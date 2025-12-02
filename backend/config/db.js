require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Fallback URI for when .env is not loaded
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('Using URI:', mongoURI.replace(/\/\/.*:.*@/, '//***:***@')); // Hide credentials in logs
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('Make sure MongoDB is running locally or check your connection string');
    process.exit(1);
  }
};

module.exports = connectDB;