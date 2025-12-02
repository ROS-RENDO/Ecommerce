const mongoose= require("mongoose")

const paymentSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ["Card", "PayPal", "Crypto", "COD"], // supported types
      required: true,
    },
    paymentstatus: {
      type: String,
      enum: ["Pending", "Processing", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    // Card payment fields
    cardNumber: { type: String }, // (⚠️ in production, don’t store raw card numbers — use tokens from Stripe/PayPal)
    expiry: { type: String },
    cardHolder: { type: String },

    // PayPal
    PayPalEmail: { type: String },

    // Crypto
    txHash: { type: String }, // blockchain transaction hash
    walletAddress: { type: String },

    // General
    amount: { type: Number }, // how much was paid
    currency: { type: String, default: "USD" },
    paidAt: { type: Date },
  },
  { _id: false }
);

const orderSchema= new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    items: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
        quantity: {type: Number, required: true},
        price: {type: Number, required: true},
        image: {
            public_id: { type: String, required: true },
            url: { type: String, required: true},
        }
    }],


    shippingAddress: {
        email: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        street: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        zipCode: {type: String, required: true},
        country: {type: String, required: true},
    },

    shipping :{
        type: { type: String, enum: ["standard", "express"], required: true,},
        cost: { type : Number, required: true}
    },
    payment: paymentSchema,
    totalPrice: { type: Number, required: true},
    status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] , default: "Pending"}
    

}, {timestamps: true})
module.exports= mongoose.model("order", orderSchema);