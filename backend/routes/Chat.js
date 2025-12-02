const express = require("express");
const router = express.Router();
const { getMessages, sendMessage } = require("../controllers/chat.js");

// /api/chat/:roomId → fetch chat history
router.get("/:roomId", getMessages);

// /api/chat/send → send a message
router.post("/send", sendMessage);

module.exports = router;
