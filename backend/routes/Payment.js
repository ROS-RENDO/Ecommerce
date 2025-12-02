const express = require("express");
const router = express.Router();
const {createPayment,capturePayPalPayment, verifyPayment, approveLocalPayment, getPaymentStatus} = require("../controllers/payment.js")

router.post("/create", createPayment);
router.post("/capture-paypal", capturePayPalPayment )
router.post("/verify", verifyPayment);
router.post("/approve", approveLocalPayment); // admin only
router.get("/:id", getPaymentStatus);

module.exports= router;