const ChatMessage = require("../models/ChatMessage");

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("🟢 New client connected");

    // Join a chat room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User joined room ${roomId}`);
    });

    // Handle message sending
    socket.on("sendMessage", async (data) => {
      const { roomId, senderId, receiverId, message } = data;

      // Save message in MongoDB
      const newMessage = new ChatMessage({ roomId, senderId, receiverId, message });
      await newMessage.save();

      // Send message to everyone in the same room
      io.to(roomId).emit("receiveMessage", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected");
    });
  });
}

module.exports = { setupSocket };
