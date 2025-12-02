const Category = require("../models/Category")

exports.createCategory= async (req,res)=>{
    try{
        const {name, slug}= req.body;

        const existing= await Category.findOne({slug})
        if( existing){
            return res.status(400).json({message: "Category already exists"})
        }
        const category= await Category.create({name, slug});
        res.status(201).json(category);
    }catch(error){
        res.status(500).json({message: error.message})
    }
}
exports.getCategories= async(req,res)=>{
    try {
        const categories= await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
exports.getCategoryById= async(req,res)=>{
    try {
        const category=await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({message: "Category not found"});
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
}
exports.updateCategory= async(req,res)=>{
    try {
        const {name, slug}= req.body;
        const category= await Category.findByIdAndUpdate(req.params.id, {name, slug}, {new: true});
        res.json(category)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
exports.deleteCategory= async(req, res)=>{
    try {
        const category= await Category.findByIdAndDelete(req.params.id);
        if (!category){
            return res.status(404).json({message: "Category not found"})
        }
        res.json({message: "Category deleted successfully"})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}