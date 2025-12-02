const Wishlist= require('../models/wishlist')
const Product= require("../models/Product")

exports.addToWishlist= async(req, res)=>{
    try {
        const userId= req.user.userId; // form auth protect middleware
        const {productId} = req.body;

        const product= await Product.findById(productId);
        if(!product) return res.status(404).json({message: "Product not found"});

        let wishlist= await Wishlist.findOne({user: userId})
        if(!wishlist){
            wishlist= await Wishlist.create({user: userId, products: [productId]})
        } else{
            if( wishlist.products.includes(productId)){
                return res.status(400).json({message: "Product already in wishlist"});
            }
            wishlist.products.push(productId);
            await wishlist.save();
        }
        res.status(201).json(wishlist);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.getWishlist= async(req, res)=>{
    try {
        const userId= req.user.userId;
        const wishlist= await Wishlist.findOne({user: userId}).populate("products");
        if(!wishlist) return res.status(404).json({message: "Wishlist not found"});
        res.json(wishlist)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.removeFromWishlist= async(req,res)=>{
    try {
        const userId= req.user.userId;
        const productId= req.params.productId;

        const wishlist= await Wishlist.findOne({user: userId});
        if(!wishlist) return res.status(404).json({message: "Wishlist not found"});

        wishlist.products= wishlist.products.filter((pId)=> pId.toString()!== productId);
        await wishlist.save();
        
        res.json({message: "Product removed from wishlist", wishlist})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.clearWishlist= async(req,res)=>{
    try {
        const userId= req.user.userId;
        const wishlist= await Wishlist.findOne({userId})
        if(!wishlist) return res.status(404).json({message: "Wishlist not found"});
        wishlist.products= [];
        await wishlist.save();

        res.json({message:"Wishlist clear successfully", wishlist});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}