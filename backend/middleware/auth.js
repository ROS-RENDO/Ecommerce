const jwt = require("jsonwebtoken"); 

exports.protect = (req, res, next) => {
    const token = req.cookies?.jwt; 
    console.log("Token received:", token);
    
    if (!token) {
        return res.status(401).json({ message: "Not authenticated!" });
    }
    
   try{
    const decoded= jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token: ", decoded)

    req.user= decoded;
    next();
   }
   catch(err){
    console.log("JWT verification error: ",err)
    return res.status(403).json({message: "Token is not valid"})
   }
};

// ✅ Admin check
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};
