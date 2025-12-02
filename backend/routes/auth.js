// routes/auth.js
const {googleLogin, googleCallback, getMe} = require("../controllers/auth.js")
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 1️⃣ Redirect to Google
router.get("/google", googleLogin);

// 2️⃣ Callback from Google
router.get("/google/callback", googleCallback);

// 3️⃣ Protected route example
router.get("/me", getMe);

module.exports = router;
