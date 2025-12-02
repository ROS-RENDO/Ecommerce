const {getCart, addToCart, updateCartItem, removeFromCart}= require('../controllers/cart.js') 
const {protect}= require('../middleware/auth.js')
const express = require('express')
const router= express.Router();

router.get("/", protect ,getCart);
router.post("/", protect, addToCart);
router.patch("/:itemId",protect ,updateCartItem);
router.delete("/:itemId",protect ,removeFromCart);

module.exports= router
