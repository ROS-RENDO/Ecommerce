const express = require("express");
const router = express.Router();
const {
  createBinancePayment,
  queryBinancePayment,
  binanceWebhook,
  closeBinancePayment,
  refundBinancePayment,
  queryRefundStatus,
} = require("../controllers/binance.js");

// Middleware for authentication (add your auth middleware)
// const { authenticate } = require("../middleware/auth");

// Create new Binance payment
router.post("/create", createBinancePayment);

// Query payment status
router.get("/query/:paymentId", queryBinancePayment);

// Webhook endpoint (no auth needed - verified by signature)
router.post("/webhook", binanceWebhook);

// Close/cancel payment
router.post("/close", closeBinancePayment);

// Refund payment
router.post("/refund", refundBinancePayment);

// Query refund status
router.get("/refund/query/:paymentId", queryRefundStatus);

module.exports = router;