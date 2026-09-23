const express = require("express");

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = require("../controllers/userController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// All user management routes require admin authentication
router.use(protect, adminOnly);

// GET ALL USERS
router.get("/", getAllUsers);

// GET SINGLE USER
router.get("/:id", getUserById);

// UPDATE USER
router.put("/:id", updateUser);

// DELETE USER
router.delete("/:id", deleteUser);

// ACTIVATE / DEACTIVATE USER
router.patch("/:id/status", toggleUserStatus);

module.exports = router;