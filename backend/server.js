require("dotenv").config(); // must be first
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// MongoDB connection
const connectDB = require("./config/db");
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Load Passport Google Strategy
require("./auth/google");

// Routes
const authRoutes = require("./routes/Auth"); // Google + local auth routes
const userRoutes = require("./routes/userRoutes");
const userProfile = require("./routes/userProfile");
const Category = require("./routes/Category");
const Product = require("./routes/Product");
const Cart = require("./routes/Cart");
const Wishlist = require("./routes/Wishlist");
const Order = require("./routes/Order");

const Chat = require("./routes/Chat");
const Payment = require("./routes/Payment");
const binancePaymentRoutes = require('./routes/binance');

// Mount routes
app.use("/api/auth", authRoutes); // Local + Google auth
app.use("/api/auth", userRoutes); // Local auth routes
app.use("/api", userProfile);
app.use("/api/category", Category);
app.use("/api/product", Product);
app.use("/api/cart", Cart);
app.use("/api/wishlist", Wishlist);
app.use("/api/orders", Order); // Your existing order routes

app.use("/api/chat", Chat);
app.use("/api/payment", Payment);
app.use('/api/payment/binance', binancePaymentRoutes);

// Create HTTP + Socket.IO server
const http = require("http");
const { Server } = require("socket.io");
const { setupSocket } = require("./socket/chatsocket");
const { initializeOrderSocket } = require("./socket/ordersocket"); 

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
});

// ============================================
// SOCKET.IO EVENT HANDLERS
// ============================================

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Chat message handler (your existing chat)
  socket.on("chatMessage", (msg) => {
    console.log("Message:", msg);
    io.emit("chatMessage", msg); // broadcast to everyone
  });

  // Disconnect handler
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Initialize existing chat socket
setupSocket(io);

// ⭐ NEW: Initialize order tracking WebSocket
initializeOrderSocket(io);

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💬 Chat WebSocket ready`);
  console.log(`📦 Order tracking WebSocket ready`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
});