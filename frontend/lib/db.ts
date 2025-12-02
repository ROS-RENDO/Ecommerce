import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  // If already connected, do nothing
  if (mongoose.connections[0].readyState) return;

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: 'nextauth',
      // no need for useNewUrlParser or useUnifiedTopology in Mongoose v7+
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};
