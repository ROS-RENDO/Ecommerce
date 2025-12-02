const ChatMessage = require("../models/ChatMessage");

// 🟢 Get all messages for a room
exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await ChatMessage.find({ roomId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// 🟢 Send a message (HTTP fallback if not using socket)
exports.sendMessage = async (req, res) => {
  try {
    const { roomId, senderId, receiverId, message } = req.body;
    const newMessage = new ChatMessage({ roomId, senderId, receiverId, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
};
