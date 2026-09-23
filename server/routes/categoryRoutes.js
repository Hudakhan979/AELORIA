const express = require("express");

const {
  getCategories,
  getCategoryById,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} = require("../controllers/categoryController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC
router.get("/", getCategories);

// ADMIN
router.get("/admin/all", protect, adminOnly, getAllCategoriesAdmin);
router.post("/admin", protect, adminOnly, createCategory);
router.put("/admin/:id", protect, adminOnly, updateCategory);
router.delete("/admin/:id", protect, adminOnly, deleteCategory);
router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  toggleCategoryStatus
);

// SINGLE CATEGORY
router.get("/:id", getCategoryById);

module.exports = router;