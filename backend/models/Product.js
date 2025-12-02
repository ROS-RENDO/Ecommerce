const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    name: { type: String },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, { timestamps: true });

const variantSchema = new mongoose.Schema({
    sku: { type: String, trim: true }, // stock keeping unit, unique id per variant
    color: { type: String, trim: true },
    size: { type: String, trim: true }, // ex: S, M, L, XL
    material: { type: String, trim: true }, // cotton, leather, etc.
    stock: { type: Number, default: 0 },
    price: { type: Number }, // can override main price
    images: [
        {
            public_id: { type: String, required: true },
            url: { type: String, required: true }
        }
    ]
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }, // base price
    description: { type: String, required: true },
    discount: { type: Number, default: 0 }, // % discount, changed to Number
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: { type: String, trim: true },

    // Product-level stock and colors
    colors: [{ type: String, trim: true }],
    stock: { type: Number, required: true, default: 0 },

    // Variants (optional per product)
    variants: [variantSchema],

    // Images for main product
    images: [
        {
            public_id: { type: String, required: true },
            url: { type: String, required: true }
        }
    ],

    // Reviews
    reviews: [reviewSchema],
    numReviews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },

    // Tags for search/marketing
    tags: [{ type: String, trim: true, lowercase: true }],

}, { timestamps: true });

// Virtual: stock status
productSchema.virtual("status").get(function () {
    if (this.stock === 0) return "Out_of_stock";
    if (this.stock < 20) return "Low_of_stock";
    return "Active";
});

// Index for search
productSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Product", productSchema);
