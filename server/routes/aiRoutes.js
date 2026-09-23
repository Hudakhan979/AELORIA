const express = require("express");

const {
  generateAIResponse,
} = require("../controllers/aiController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// AELORIA AI Chat
router.post("/chat", protect, generateAIResponse);

module.exports = router;