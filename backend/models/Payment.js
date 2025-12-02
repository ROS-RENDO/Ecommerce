const mongoose= require("mongoose")

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  method: { type: String, enum: ["paypal", "crypto", "local", "binance"], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "waiting"],
    default: "pending",
  },
  transactionId: { type: String },
  proofImage: { type: String }, // for local payments
  createdAt: { type: Date, default: Date.now },
});

module.exports= mongoose.model("payment", paymentSchema);
