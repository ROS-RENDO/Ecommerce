const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.getCart = async (req, res) => {
    try {
        console.log('req.user:', req.user); // Debug log
        
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const cart = await Cart.findOne({ user: req.user.userId }).populate("items.product");
        if (!cart) {
            return res.json({ items: [], totalPrice: 0 });
        }
        res.json(cart);
    } catch (err) {
        console.error('Get cart error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { productId, quantity = 1 } = req.body;
        
        // Validate input
        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        
        if (quantity <= 0) {
            return res.status(400).json({ error: "Quantity must be greater than 0" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        let cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            console.log('Creating new cart for user:', req.user.userId);
            cart = new Cart({ 
                user: req.user.userId, 
                items: [], 
                totalPrice: 0 
            });
        }

        const existingItemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId.toString()
        );

        if (existingItemIndex !== -1) {
            // Item exists, update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Item doesn't exist, add new item
            cart.items.push({ 
                product: productId, 
                quantity: quantity 
            });
        }

        // Recalculate total price
        cart.totalPrice = await calculateTotal(cart.items);
        
        await cart.save();
        
        // Populate the cart before sending response
        await cart.populate("items.product");
        res.status(201).json(cart);
    } catch (err) {
        console.error('Add to cart error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { quantity } = req.body;

        
        // Validate quantity
        if (quantity <= 0) {
            return res.status(400).json({ error: "Quantity must be greater than 0" });
        }

        let cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const item = cart.items.id(req.params.itemId);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        item.quantity = quantity;
        cart.totalPrice = await calculateTotal(cart.items);
        await cart.save();
        
        // Populate the cart before sending response
        await cart.populate("items.product");
        console.log(item.quantity)
        res.json(cart);
    } catch (err) {
        console.error('Update cart item error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        let cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => !item._id.equals(req.params.itemId));
        
        // Check if item was actually removed
        if (cart.items.length === initialLength) {
            return res.status(404).json({ error: "Item not found" });
        }

        cart.totalPrice = await calculateTotal(cart.items);
        await cart.save();
        
        // Populate the cart before sending response
        await cart.populate("items.product");
        res.json(cart);
    } catch (err) {
        console.error('Remove from cart error:', err);
        res.status(500).json({ error: err.message });
    }
};

const calculateTotal = async (items) => {
    let total = 0;
    for (let item of items) {
        const product = await Product.findById(item.product);
        if (product) {
            total += item.quantity * product.price;
        }
    }
    return total;
};