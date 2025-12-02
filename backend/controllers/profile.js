const User = require("../models/User");
const Order= require("../models/Order")
const getProfile= async ( req, res)=>{
    console.log("req user", req.user)
    try {
        const user= await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({message: "User not found"});
        res.json(user)

    } catch (error) {
        console.error("Error fetching profile:", error)
        res.status(500).json({message: "Server error"});
        
    }
}
const updateProfile = async(req,res)=>{
    try {
        const user= await User.findById(req.user.userId);
        if (!user) return res.status(404).json({message: "User not found"});
        user.username= req.body.username || user.username
        user.email= req.body.email || user.email

        if (req.body.password){
            user.password= req.body.password;
            const updateUser= await user.save();
        }
        res.json(updateUser)
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({message: "Server error"})
    }

};

const getCustomers= async(req,res )=>{
    try {
        const users = await User.find({ isAdmin: false }); // only custom   ers
        const customers = await Promise.all(users.map(async (user) => {
        const orders = await Order.find({ user: user._id });
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);

      return {
        _id: user._id,
        name: `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.username,
        email: user.email,
        totalOrders,
        totalSpent,
        joined: user.createdAt
      };
    }));
    res.json(customers);
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}
const getAdmins= async(req,res)=>{
    try {
        const admin= await User.find({isAdmin: true}).select("-password")
        res.json(admin)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}
module.exports= { getProfile, updateProfile, getCustomers, getAdmins}