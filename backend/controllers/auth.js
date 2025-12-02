require('dotenv').config();
const axios = require("axios");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
// Optional: Uncomment to enable email sending
// const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/emailService");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/emailService");

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );
};

// ✅ Register Controller
exports.register = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    if (!firstname || !lastname || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!username.startsWith('@')) {
      return res.status(400).json({ message: "Username must start with @" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    const user = new User({ 
      firstname, 
      lastname, 
      username, 
      email, 
      password,
      verificationCode,
      verificationCodeExpire,
      isVerified: false,
      authProvider: 'local'
    });
    await user.save();

    // Log verification code to console (for development)
    console.log(`\n========================================`);
    console.log(`📧 Verification Code for ${email}`);
    console.log(`CODE: ${verificationCode}`);
    console.log(`Expires in 15 minutes`);
    console.log(`========================================\n`);

    await sendVerificationEmail(email, verificationCode)
    
    // Email sending is disabled for development
    // To enable: uncomment sendVerificationEmail and add credentials to .env
    // try {
    //   await sendVerificationEmail(email, verificationCode);
    // } catch (emailErr) {
    //   console.error('Email sending failed, but user created. Code in console.');
    // }

    return res.status(201).json({
      message: "Registration successful! Please check your email for verification code.",
      requiresVerification: true,
      email: user.email
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if user registered with Google only (no password set)
    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({ 
        message: "This account was created with Google. Please login with Google instead.",
        authProvider: 'google'
      });
    }

    // For 'both' authProvider: allow login with JWT password only
    // Google login will use the googleCallback route instead
    if (!user.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    if (!(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ⭐ NEW: Check if email is verified for local/both accounts
    if ((user.authProvider === 'local' || user.authProvider === 'both') && !user.isVerified) {
      
      // Generate NEW verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationCodeExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

      user.verificationCode = verificationCode;
      user.verificationCodeExpire = verificationCodeExpire;
      await user.save();

      // Log to console
      console.log(`\n========================================`);
      console.log(`📧 NEW Verification Code for ${email}`);
      console.log(`CODE: ${verificationCode}`);
      console.log(`Expires in 15 minutes`);
      console.log(`(Sent because user tried to login without verification)`);
      console.log(`========================================\n`);

      // Try to send email (won't fail if email not configured)
      try {
        await sendVerificationEmail(email, verificationCode);
      } catch (emailErr) {
        console.error('Email sending failed, but code is in console above.');
      }

      return res.status(403).json({ 
        message: "Please verify your email before logging in. A new verification code has been sent to your email.",
        requiresVerification: true,
        email: user.email,
        codeResent: true
      });
    }

    if (rememberMe) {
      const refreshToken = generateRefreshToken(user);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
    }

    const token = generateToken(user);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        authProvider: user.authProvider,
        token: generateToken(user),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetCode = code;
    user.resetCodeExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    console.log(`Reset code for ${email}: ${code}`);
    await sendPasswordResetEmail(email, code);

    res.json({ message: "Reset code sent to your email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetCode !== code ||
      !user.resetCodeExpire ||
      user.resetCodeExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    res.json({ message: "Code verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword, confirmPassword } = req.body;
    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetCode !== code ||
      !user.resetCodeExpire ||
      user.resetCodeExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    user.password = newPassword;
    user.resetCode = undefined;
    user.resetCodeExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Verify Email Controller
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and verification code are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    if (
      !user.verificationCode ||
      user.verificationCode !== code ||
      !user.verificationCodeExpire ||
      user.verificationCodeExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpire = undefined;
    await user.save();

    // Generate token for auto-login after verification
    const token = generateToken(user);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Email verified successfully! You are now logged in.",
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Resend Verification Code Controller
exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.verificationCode = verificationCode;
    user.verificationCodeExpire = verificationCodeExpire;
    await user.save();

    // TODO: Send verification email
    console.log(`New verification code for ${email}: ${verificationCode}`);
    // Example: await sendVerificationEmail(email, verificationCode);
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({
      message: "Verification code has been resent to your email",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout Controller
exports.logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FRONTEND_URL = "http://localhost:3000";
const REDIRECT_URI = "http://localhost:5000/api/auth/google/callback";

// Redirect to Google login
exports.googleLogin = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&scope=openid%20email%20profile&redirect_uri=${REDIRECT_URI}`;
  res.redirect(url);
};

// Google callback - FIXED VERSION
exports.googleCallback = async (req, res) => {
  const code = req.query.code;

  console.log("Google callback code:", code);

  try {
    // Exchange code for tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    console.log("Token response:", tokenRes.data);

    const { access_token } = tokenRes.data;

    // Get user info from Google
    const userInfoRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    console.log("User info response:", userInfoRes.data);

    const googleUser = userInfoRes.data;
    // googleUser contains: id, email, verified_email, name, given_name, family_name, picture

    // Find user by email
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      // Create new user with Google data
      user = await User.create({
        email: googleUser.email,
        given_name: googleUser.given_name,
        family_name: googleUser.family_name,
        name: googleUser.name,
        picture: googleUser.picture,
        googleId: googleUser.id,
        authProvider: 'google',
        isVerified: true, // Google accounts are pre-verified
        isAdmin: false
      });
      console.log("New Google user created:", user);
    } else {
      // Update existing user with latest Google info
      user.given_name = googleUser.given_name;
      user.family_name = googleUser.family_name;
      user.name = googleUser.name;
      user.picture = googleUser.picture;
      user.googleId = googleUser.id;
      
      // If user has a password (JWT account), allow both login methods
      if (user.password && user.authProvider === 'local') {
        user.authProvider = 'both';
      } else if (!user.authProvider) {
        user.authProvider = 'google';
      }
      // If authProvider is already 'google' or 'both', keep it as is
      
      await user.save();
      console.log("Existing user updated with Google data:", user);
    }

    // Generate JWT with user._id (not googleUser.id)
    // Google login bypasses password - it uses Google's OAuth for authentication
    const jwtToken = generateToken(user);

    // Set cookie
    res.cookie("jwt", jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    // Redirect to frontend
    res.redirect(`${FRONTEND_URL}?login=success`);

  } catch (err) {
    console.error("Google auth error details:", err.response?.data || err.message);
    res.redirect(`${FRONTEND_URL}/auth/login?error=google_auth_failed`);
  }
};

// Protected route - Get current user
exports.getMe = async (req, res) => {
  const token = req.cookies.jwt;
  
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get full user data from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data with all fields (both JWT and Google)
    res.json({
      user: {
        id: user._id,
        email: user.email,
        // JWT/Local auth fields
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        // Google auth fields
        given_name: user.given_name,
        family_name: user.family_name,
        name: user.name,
        picture: user.picture,
        googleId: user.googleId,
        // Common fields
        isAdmin: user.isAdmin,
        authProvider: user.authProvider || 'local'
      }
    });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};