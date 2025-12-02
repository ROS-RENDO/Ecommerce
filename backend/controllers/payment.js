const dotenv = require("dotenv");
dotenv.config();
const Payment = require("../models/Payment.js");
const fetch = require("node-fetch");

// Helper function to get PayPal auth header
const getPayPalAuth = () => {
  return `Basic ${Buffer.from(
    process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
  ).toString("base64")}`;
};

// --------------- CREATE PAYMENT ----------------
exports.createPayment = async (req, res) => {
  try {
    const { orderId, userId, amount, method } = req.body;

    if (!orderId || !userId || !amount || !method)
      return res.status(400).json({ message: "Missing required fields" });

    let payment = await Payment.create({
      orderId,
      userId,
      amount,
      method,
      status: "pending",
    });

    // handle specific payment gateways
    if (method === "paypal") {
      try {
        const paypalResponse = await fetch(
          "https://api-m.sandbox.paypal.com/v2/checkout/orders",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: getPayPalAuth(),
            },
            body: JSON.stringify({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: amount.toString(),
                  },
                },
              ],
              ...(process.env.FRONTEND_URL && {
                application_context: {
                  return_url: `${process.env.FRONTEND_URL}/cart/checkout/payment/success`,
                  cancel_url: `${process.env.FRONTEND_URL}/cart/checkout/payment/cancel`,
                },
              }),
            }),
          }
        );

        const data = await paypalResponse.json();

        if (!paypalResponse.ok) {
          console.error("PayPal API error:", data);
          return res.status(400).json({
            message: "PayPal API error",
            error: data.message || data.error,
            details: data.details,
          });
        }

        payment.transactionId = data.id;
        payment.status = "pending";
        await payment.save();

        return res.json({
          message: "PayPal payment created",
          paymentId: payment._id,
          paypalOrderId: data.id,
          approvalUrl: data.links?.find((l) => l.rel === "approve")?.href,
        });
      } catch (error) {
        console.error("PayPal error:", error);
        return res.status(500).json({
          message: "Error creating PayPal payment",
          error: error.message,
        });
      }
    }

    // UPDATED: Binance integration
    if (method === "binance") {
      try {
        // Forward to Binance payment controller
        const binanceResponse = await fetch(
          `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/binance/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId,
              userId,
              amount,
              currency: req.body.currency || "USDT",
            }),
          }
        );

        const binanceData = await binanceResponse.json();

        if (!binanceResponse.ok) {
          throw new Error(binanceData.message || "Binance payment creation failed");
        }

        return res.json({
          message: "Binance payment created",
          paymentId: binanceData.paymentId,
          binanceOrderId: binanceData.binanceOrderId,
          checkoutUrl: binanceData.checkoutUrl,
          qrcodeLink: binanceData.qrcodeLink,
          qrContent: binanceData.qrContent,
          universalUrl: binanceData.universalUrl,
          expireTime: binanceData.expireTime,
        });
      } catch (error) {
        console.error("Binance error:", error);
        return res.status(500).json({
          message: "Error creating Binance payment",
          error: error.message,
        });
      }
    }

    if (method === "crypto") {
      payment.transactionId = "CRYPTO_TX_" + Date.now();
      payment.status = "pending";
      await payment.save();

      return res.json({
        message: "Send crypto to the following address:",
        walletAddress: "0x1234567890ABCDEF",
        paymentId: payment._id,
      });
    }

    if (method === "local") {
      payment.status = "waiting";
      await payment.save();

      return res.json({
        message: "Please upload your payment slip.",
        paymentId: payment._id,
      });
    }

    res.status(400).json({ message: "Invalid payment method" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// --------------- CAPTURE PAYPAL PAYMENT ----------------
exports.capturePayPalPayment = async (req, res) => {
  try {
    const { paymentId, paypalOrderId } = req.body;

    if (!paymentId || !paypalOrderId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const captureResponse = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getPayPalAuth(),
        },
      }
    );

    const data = await captureResponse.json();

    if (!captureResponse.ok) {
      console.error("PayPal capture error:", data);
      return res.status(400).json({
        message: "Failed to capture payment",
        error: data.message || data.error,
        details: data.details,
      });
    }

    if (data.status === "COMPLETED") {
      payment.status = "completed";
      payment.transactionId = paypalOrderId;
      await payment.save();

      return res.json({
        message: "Payment captured successfully",
        payment,
        paypalData: data,
      });
    } else {
      return res.status(400).json({
        message: "Payment capture incomplete",
        status: data.status,
        paypalData: data,
      });
    }
  } catch (err) {
    console.error("Capture error:", err);
    res.status(500).json({
      message: "Error capturing payment",
      error: err.message,
    });
  }
};

// --------------- VERIFY PAYMENT ----------------
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, proofImage } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (payment.method === "paypal") {
      try {
        const verifyResponse = await fetch(
          `https://api-m.sandbox.paypal.com/v2/checkout/orders/${payment.transactionId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: getPayPalAuth(),
            },
          }
        );

        const data = await verifyResponse.json();

        if (!verifyResponse.ok) {
          return res.status(400).json({
            message: "Error verifying PayPal payment",
            error: data,
          });
        }

        if (data.status === "COMPLETED") {
          payment.status = "completed";
          await payment.save();
          return res.json({ message: "PayPal payment verified", payment });
        } else if (data.status === "APPROVED") {
          return res.status(400).json({
            message: "Payment approved but not captured yet",
            status: data.status,
          });
        } else {
          return res.status(400).json({
            message: "Payment not completed",
            status: data.status,
          });
        }
      } catch (error) {
        console.error("Verify error:", error);
        return res.status(500).json({
          message: "Error verifying payment",
          error: error.message,
        });
      }
    }

    // UPDATED: Binance verification
    if (payment.method === "binance") {
      try {
        const verifyResponse = await fetch(
          `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/binance/query/${paymentId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await verifyResponse.json();

        if (!verifyResponse.ok) {
          return res.status(400).json({
            message: "Error verifying Binance payment",
            error: data.message,
          });
        }

        return res.json({
          message: "Binance payment status retrieved",
          payment: data.payment,
          binanceStatus: data.binanceStatus,
        });
      } catch (error) {
        console.error("Binance verify error:", error);
        return res.status(500).json({
          message: "Error verifying Binance payment",
          error: error.message,
        });
      }
    }

    if (payment.method === "crypto") {
      payment.status = "completed";
      await payment.save();
      return res.json({ message: "Crypto payment marked complete", payment });
    }

    if (payment.method === "local") {
      payment.proofImage = proofImage;
      payment.status = "waiting";
      await payment.save();
      return res.json({
        message: "Payment proof uploaded, awaiting approval",
        payment,
      });
    }

    res.status(400).json({ message: "Invalid payment method" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// --------------- ADMIN MANUAL APPROVE ----------------
exports.approveLocalPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Not found" });

    payment.status = "completed";
    await payment.save();
    res.json({ message: "Local payment approved", payment });
  } catch (err) {
    res.status(500).json({
      message: "Error approving payment",
      error: err.message,
    });
  }
};

// --------------- STATUS CHECK ----------------
exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching payment status",
      error: err.message,
    });
  }
};