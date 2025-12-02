const { getProfile, updateProfile, getCustomers , getAdmins} = require("../controllers/profile.js");
const {protect}= require("../middleware/auth.js")
const express= require('express')
const router= express.Router()

router.get("/profile",protect, getProfile)
router.put("/profile",protect, updateProfile)
router.get("/customer", protect, getCustomers)
router.get("/admin", protect, getAdmins)


module.exports= router