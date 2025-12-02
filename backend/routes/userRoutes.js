// rconst { register, login, createAdmin, logout } = require("../controllers/auth.js");
const { register, login, logout, forgotPassword, verifyCode, resetPassword, verifyEmail , resendVerificationCode} = require("../controllers/auth.js");

const { protect, adminOnly } = require("../middleware/auth.js");

const express = require("express");
const router = express.Router();


router.post("/register", register);
router.post("/login", login);

router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationCode);

router.post("/forgot-password", forgotPassword);
router.post("/verify-code", verifyCode);
router.post("/reset-password", resetPassword);


router.post("/logout", logout)

router.get("/admin", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome, Admin 👑", user: req.user });
});
router.get("/order", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome, order ", user: req.user });
});

module.exports = router;
