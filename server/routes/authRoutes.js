const express = require("express");

const {
  registerUser,
  loginUser,
  loginAdmin,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Student Registration
router.post("/register", registerUser);

// Student Login
router.post("/login", loginUser);

// Admin Login
router.post("/admin/login", loginAdmin);

// User Profile (Authenticated)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;