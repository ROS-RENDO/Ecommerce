const crypto = require("crypto");
const Payment = require("../models/Payment.js");
const fetch = require("node-fetch");

// Binance Pay API Configuration
const BINANCE_API_URL = process.env.BINANCE_API_URL || "https://bpay.binanceapi.com";
const BINANCE_API_KEY = process.env.BINANCE_API_KEY;
const BINANCE_API_SECRET = process.env.BINANCE_API_SECRET;

/**
 * Generate Binance Pay signature
 */
const generateBinanceSignature = (timestamp, payload) => {
  const queryString = `${timestamp}\n${payload}\n`;
  return crypto
    .createHmac("sha512", BINANCE_API_SECRET)
    .update(queryString)
    .digest("hex")
    .toUpperCase();
};

/**
 * Make authenticated request to Binance Pay API
 */
const binanceRequest = async (endpoint, method = "POST", body = {}) => {
  const timestamp = Date.now();
  const payload = JSON.stringify(body);
  const signature = generateBinanceSignature(timestamp, payload);

  const response = await fetch(`${BINANCE_API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "BinancePay-Timestamp": timestamp.toString(),
      "BinancePay-Nonce": crypto.randomBytes(16).toString("hex"),
      "BinancePay-Certificate-SN": BINANCE_API_KEY,
      "BinancePay-Signature": signature,
    },
    body: method !== "GET" ? payload : undefined,
  });

  const data = await response.json();
  
  if (!response.ok || data.status !== "SUCCESS") {
    throw new Error(data.errorMessage || "Binance Pay API error");
  }

  return data.data;
};

/**
 * CREATE BINANCE PAYMENT ORDER
 * Creates a payment order on Binance Pay
 */
exports.createBinancePayment = async (req, res) => {
  try {
    const { orderId, userId, amount, currency = "USDT" } = req.body;

    if (!orderId || !userId || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate Binance credentials
    if (!BINANCE_API_KEY || !BINANCE_API_SECRET) {
      return res.status(500).json({ 
        message: "Binance Pay not configured. Please add API credentials." 
      });
    }

    // Create payment record in database
    const payment = await Payment.create({
      orderId,
      userId,
      amount,
      method: "binance",
      status: "pending",
    });

    // Create Binance Pay order
    const binanceOrder = {
      env: {
        terminalType: "WEB",
      },
      merchantTradeNo: payment._id.toString(), // Use our payment ID as reference
      orderAmount: parseFloat(amount).toFixed(2),
      currency,
      goods: {
        goodsType: "01", // Virtual goods
        goodsCategory: "Z000", // Others
        referenceGoodsId: orderId,
        goodsName: `Order ${orderId}`,
        goodsDetail: `Payment for order ${orderId}`,
      },
      shipping: {
        shippingName: null,
        shippingAddress: null,
        shippingPhoneNo: null,
      },
      buyer: {
        referenceBuyerId: userId,
      },
      returnUrl: `${process.env.FRONTEND_URL}/cart/checkout/payment/success?orderId=${orderId}`,
      cancelUrl: `${process.env.FRONTEND_URL}/cart/checkout/payment/cancel?orderId=${orderId}`,
      webhookUrl: `${process.env.BACKEND_URL}/api/payments/binance/webhook`,
    };

    const binanceResponse = await binanceRequest(
      "/binancepay/openapi/v2/order",
      "POST",
      binanceOrder
    );

    // Update payment with Binance details
    payment.transactionId = binanceResponse.prepayId;
    payment.binanceOrderId = binanceResponse.prepayId;
    await payment.save();

    return res.json({
      message: "Binance payment created successfully",
      paymentId: payment._id,
      binanceOrderId: binanceResponse.prepayId,
      qrcodeLink: binanceResponse.qrcodeLink, // QR code for mobile payment
      qrContent: binanceResponse.qrContent, // QR code content
      checkoutUrl: binanceResponse.checkoutUrl, // Universal payment URL
      universalUrl: binanceResponse.universalUrl, // Deep link for Binance app
      deeplink: binanceResponse.deeplink, // Alternative deep link
      expireTime: binanceResponse.expireTime,
    });
  } catch (error) {
    console.error("Binance Pay error:", error);
    return res.status(500).json({
      message: "Error creating Binance payment",
      error: error.message,
    });
  }
};

/**
 * QUERY BINANCE PAYMENT STATUS
 * Check the status of a Binance payment
 */
exports.queryBinancePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (!payment.transactionId) {
      return res.status(400).json({ 
        message: "No Binance transaction ID found" 
      });
    }

    // Query Binance for order status
    const queryData = {
      merchantTradeNo: payment._id.toString(),
      prepayId: payment.transactionId,
    };

    const binanceStatus = await binanceRequest(
      "/binancepay/openapi/v2/order/query",
      "POST",
      queryData
    );

    // Update payment status based on Binance response
    const statusMap = {
      INITIAL: "pending",
      PENDING: "pending",
      PAID: "completed",
      CANCELED: "failed",
      ERROR: "failed",
      REFUNDING: "refunding",
      REFUNDED: "refunded",
      EXPIRED: "failed",
    };

    const newStatus = statusMap[binanceStatus.status] || "pending";
    
    if (payment.status !== newStatus) {
      payment.status = newStatus;
      payment.binanceStatus = binanceStatus.status;
      payment.transactionTime = binanceStatus.transactionTime;
      await payment.save();
    }

    return res.json({
      message: "Payment status retrieved",
      payment,
      binanceStatus: binanceStatus.status,
      transactionId: binanceStatus.transactionId,
      transactTime: binanceStatus.transactTime,
    });
  } catch (error) {
    console.error("Query error:", error);
    return res.status(500).json({
      message: "Error querying payment status",
      error: error.message,
    });
  }
};

/**
 * BINANCE PAY WEBHOOK HANDLER
 * Receives payment notifications from Binance
 */
exports.binanceWebhook = async (req, res) => {
  try {
    const { body, headers } = req;
    
    // Verify webhook signature
    const timestamp = headers["binancepay-timestamp"];
    const nonce = headers["binancepay-nonce"];
    const signature = headers["binancepay-signature"];
    const certificateSN = headers["binancepay-certificate-sn"];

    // Verify certificate matches
    if (certificateSN !== BINANCE_API_KEY) {
      return res.status(401).json({ message: "Invalid certificate" });
    }

    // Verify signature
    const payload = JSON.stringify(body);
    const expectedSignature = generateBinanceSignature(timestamp, payload);
    
    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return res.status(401).json({ message: "Invalid signature" });
    }

    // Process the webhook
    const { bizType, bizId, bizStatus, data } = body;

    if (bizType === "PAY") {
      const merchantTradeNo = data.merchantTradeNo;
      const payment = await Payment.findById(merchantTradeNo);

      if (!payment) {
        console.error("Payment not found:", merchantTradeNo);
        return res.status(404).json({ message: "Payment not found" });
      }

      // Update payment status
      if (bizStatus === "PAY_SUCCESS") {
        payment.status = "completed";
        payment.transactionId = data.transactionId;
        payment.transactionTime = data.transactTime;
        payment.binanceStatus = "PAID";
        await payment.save();

        console.log(`Payment ${payment._id} completed successfully`);
      } else if (bizStatus === "PAY_CLOSED") {
        payment.status = "failed";
        payment.binanceStatus = "CANCELED";
        await payment.save();

        console.log(`Payment ${payment._id} was closed/canceled`);
      }
    }

    // Acknowledge webhook receipt
    return res.json({ 
      returnCode: "SUCCESS",
      returnMessage: "OK"
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({
      returnCode: "FAIL",
      returnMessage: error.message,
    });
  }
};

/**
 * CLOSE BINANCE PAYMENT
 * Cancel an unpaid Binance order
 */
exports.closeBinancePayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "completed") {
      return res.status(400).json({ 
        message: "Cannot close completed payment" 
      });
    }

    const closeData = {
      merchantTradeNo: payment._id.toString(),
      prepayId: payment.transactionId,
    };

    await binanceRequest(
      "/binancepay/openapi/v2/order/close",
      "POST",
      closeData
    );

    payment.status = "failed";
    payment.binanceStatus = "CANCELED";
    await payment.save();

    return res.json({
      message: "Binance payment closed successfully",
      payment,
    });
  } catch (error) {
    console.error("Close payment error:", error);
    return res.status(500).json({
      message: "Error closing payment",
      error: error.message,
    });
  }
};

/**
 * REFUND BINANCE PAYMENT
 * Initiate a refund for a completed payment
 */
exports.refundBinancePayment = async (req, res) => {
  try {
    const { paymentId, refundAmount, reason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "completed") {
      return res.status(400).json({ 
        message: "Can only refund completed payments" 
      });
    }

    const refundData = {
      refundRequestId: `${payment._id}_${Date.now()}`, // Unique refund ID
      prepayId: payment.transactionId,
      refundAmount: refundAmount || payment.amount,
      refundReason: reason || "Customer refund request",
    };

    const refundResponse = await binanceRequest(
      "/binancepay/openapi/v2/order/refund",
      "POST",
      refundData
    );

    payment.status = "refunding";
    payment.refundId = refundResponse.refundId;
    await payment.save();

    return res.json({
      message: "Refund initiated successfully",
      payment,
      refundId: refundResponse.refundId,
      refundStatus: refundResponse.refundStatus,
    });
  } catch (error) {
    console.error("Refund error:", error);
    return res.status(500).json({
      message: "Error processing refund",
      error: error.message,
    });
  }
};

/**
 * QUERY REFUND STATUS
 * Check the status of a refund
 */
exports.queryRefundStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment || !payment.refundId) {
      return res.status(404).json({ 
        message: "Payment or refund not found" 
      });
    }

    const queryData = {
      refundRequestId: payment.refundId,
    };

    const refundStatus = await binanceRequest(
      "/binancepay/openapi/v2/order/refund/query",
      "POST",
      queryData
    );

    // Update payment if refund is complete
    if (refundStatus.refundStatus === "SUCCESS") {
      payment.status = "refunded";
      await payment.save();
    }

    return res.json({
      message: "Refund status retrieved",
      refundStatus: refundStatus.refundStatus,
      refundAmount: refundStatus.refundAmount,
      refundedTime: refundStatus.refundedTime,
    });
  } catch (error) {
    console.error("Refund query error:", error);
    return res.status(500).json({
      message: "Error querying refund status",
      error: error.message,
    });
  }
};