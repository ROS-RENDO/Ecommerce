const Product = require("../models/Product.js");
const Category = require("../models/Category.js");
const cloudinary = require("../utils/cloudinary.js");
const User = require("../models/User.js");

/**
 * Create Product
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, colors, stock, discount, variants, tags } = req.body;
    const files = req.files || []; // accept multiple images

    // Parse arrays
    let parsedColors = [];
    let parsedVariants = [];
    let parsedTags = [];
    try { if (colors) parsedColors = JSON.parse(colors); } catch (e) {}
    try { if (variants) parsedVariants = JSON.parse(variants); } catch (e) {}
    try { if (tags) parsedTags = JSON.parse(tags); } catch (e) {}

    // Upload images
    let uploadedImages = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
      uploadedImages.push({ public_id: result.public_id, url: result.secure_url });
    }

    const product = new Product({
      name,
      price,
      description,
      discount: discount || 0,
      category,
      colors: parsedColors,
      stock,
      variants: parsedVariants,
      tags: parsedTags,
      images: uploadedImages,
    });

    await product.save();

    if (category) {
      await Category.findByIdAndUpdate(category, { $push: { products: product._id } });
    }

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get Products (with search)
 */
exports.getProduct = async (req, res) => {
  try {
    const search = req.query.search || "";
    const limit = parseInt(req.query.limit) || 0; // 0 means no limit
    const random = req.query.random === 'true'; // if true, randomize results
    const category = req.query.category || ""; // filter by category

    let query = {};

    // Category filter
    if (category) {
      const foundCategory = await Category.findOne({ slug: category });
      if (foundCategory) {
        query.category = foundCategory._id;
      }
    }

    // Search filter
    if (search) {
      if (search.length >= 3) {
        query.$text = { $search: search };
      } else {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ];
      }
    }

    let products;

    if (random) {
      // Get random products using MongoDB aggregation
      products = await Product.aggregate([
        { $match: query },
        { $sample: { size: limit || 8 } }, // Random sample
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            name: 1,
            price: 1,
            description: 1,
            discount: 1,
            images: 1,
            colors: 1,
            stock: 1,
            variants: 1,
            tags: 1,
            rating: 1,
            numReviews: 1,
            reviews: 1,
            "category.name": 1,
            "category.slug": 1
          }
        }
      ]);
    } else {
      // Regular query with limit
      let queryBuilder = Product.find(query).populate("category", "name slug");
      
      if (limit > 0) {
        queryBuilder = queryBuilder.limit(limit);
      }
      
      products = await queryBuilder;
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products!", error });
  }
};

/**
 * Get Product by ID
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate({
        path: "reviews.user",
        select: "firstname lastname username"
      });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: "Invalid product ID format" });
    }
    
    res.status(500).json({ message: "Error fetching product!", error: error.message });
  }
};

/**
 * Delete Product
 */
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete all images
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    if (product.category) {
      await Category.findByIdAndUpdate(product.category, { $pull: { products: productId } });
    }

    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get Featured Products
 */
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.aggregate([
      { $match: { stock: { $gt: 0 } } }, // Only products in stock
      { $sample: { size: limit } }, // Random sample
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: 1,
          price: 1,
          description: 1,
          discount: 1,
          images: 1,
          colors: 1,
          stock: 1,
          variants: 1,
          tags: 1,
          rating: 1,
          numReviews: 1,
          "category.name": 1,
          "category.slug": 1,
          "category._id": 1
        }
      }
    ]);

    res.json(products);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ message: "Error fetching featured products!", error });
  }
};

/**
 * Create or Update Review
 */
exports.createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user.userId).select("firstname lastname username");

    const reviewerName = `${user.firstname || ""} ${user.lastname || ""}`.trim() || user.username;

    const existingReview = product.reviews.find(
      (r) => r.user.toString() === req.user.userId.toString()
    );

    const parsedRating = Number(rating);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "Please provide a valid rating (1-5)" });
    }

    if (existingReview) {
      // Update review
      existingReview.rating = parsedRating;
      existingReview.comment = comment;
    } else {
      // New review
      product.reviews.push({ user: req.user.userId, name: reviewerName, rating: parsedRating, comment });
    }

    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.numReviews;

    await product.save();

    res.status(201).json({ message: "Review submitted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update Product
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, colors, stock, discount, variants, tags } = req.body;
    const files = req.files || [];

    let product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // If new images uploaded → replace all
    if (files.length > 0) {
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      let uploadedImages = [];
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
        uploadedImages.push({ public_id: result.public_id, url: result.secure_url });
      }
      product.images = uploadedImages;
    }

    // Parse arrays if given
    let parsedColors = colors ? JSON.parse(colors) : product.colors;
    let parsedVariants = variants ? JSON.parse(variants) : product.variants;
    let parsedTags = tags ? JSON.parse(tags) : product.tags;

    // Update fields
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;
    product.colors = parsedColors;
    product.stock = stock || product.stock;
    product.discount = discount !== undefined ? discount : product.discount;
    product.variants = parsedVariants;
    product.tags = parsedTags;

    // Handle category change (remove from old, add to new)
    if (category && category.toString() !== product.category.toString()) {
      await Category.findByIdAndUpdate(product.category, { $pull: { products: product._id } });
      await Category.findByIdAndUpdate(category, { $push: { products: product._id } });
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};