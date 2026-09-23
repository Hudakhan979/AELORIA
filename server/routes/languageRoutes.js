const express = require("express");

const {
  getLanguages,
  getLanguageById,
  getAllLanguagesAdmin,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  toggleLanguageStatus,
} = require("../controllers/languageController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC
router.get("/", getLanguages);

// ADMIN
router.get("/admin/all", protect, adminOnly, getAllLanguagesAdmin);
router.post("/admin", protect, adminOnly, createLanguage);
router.put("/admin/:id", protect, adminOnly, updateLanguage);
router.delete("/admin/:id", protect, adminOnly, deleteLanguage);
router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  toggleLanguageStatus
);

// SINGLE LANGUAGE
router.get("/:id", getLanguageById);

module.exports = router;