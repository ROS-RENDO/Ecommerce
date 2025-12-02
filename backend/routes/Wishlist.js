const {addToWishlist, getWishlist, removeFromWishlist, clearWishlist}= require("../controllers/wishlist.js")
const { protect }= require('../middleware/auth.js')
const express= require('express')
const router= express.Router();

router.post("/", protect, addToWishlist)
router.get("/", protect, getWishlist)
router.delete("/:productId", protect, removeFromWishlist)
router.delete("/clear", protect, clearWishlist)

module.exports= router