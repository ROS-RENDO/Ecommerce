const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // JWT/Local authentication fields
    firstname: {
      type: String,
      trim: true
    },
    lastname: {
      type: String,
      trim: true
    },
    username: {
      type: String,
      trim: true,
      sparse: true, // Allows null/undefined but unique if present
      unique: true
    },
    password: {
      type: String,
      select: false // Don't include by default in queries
    },

    // Google authentication fields
    given_name: {
      type: String,
      trim: true
    },
    family_name: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    picture: {
      type: String
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true // Allows null but unique if present
    },

    // Common fields
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'both'],
      default: 'local'
    },
    isAdmin: {
      type: Boolean,
      default: false
    },

    // Password reset fields
    resetCode: String,
    resetCodeExpire: Date,

    // Email verification fields
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationCode: String,
    verificationCodeExpire: Date
  },
  {
    timestamps: true // Adds createdAt and updatedAt
  }
);

// Hash password before saving (only for local auth)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  // Only hash if password exists (local auth)
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method (for local auth)
userSchema.methods.matchPassword = async function (enteredPassword) {
  // If no password (Google auth), return false
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual to get display name
userSchema.virtual('displayName').get(function() {
  if (this.authProvider === 'google') {
    return this.name || `${this.given_name} ${this.family_name}`;
  }
  return `${this.firstname} ${this.lastname}`;
});

module.exports = mongoose.model("User", userSchema);