const {createProduct, getProduct, deleteProduct, createProductReview, updateProduct, getFeaturedProducts, getProductById} = require('../controllers/product.js')

const {protect}= require('../middleware/auth.js')

const express= require('express')
const router= express.Router();
const multer= require("multer");
const upload= multer({dest: "uploads/"});

router.get("/", getProduct);
router.post("/", upload.single("file"),createProduct)
router.get("/:id", getProductById)
router.get("/featured", getFeaturedProducts)
router.put("/:id",upload.single("file"), updateProduct)
router.delete("/:id", deleteProduct)
router.post("/:id/review", protect, createProductReview)

module.exports= router