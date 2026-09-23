const express = require("express");

const {
  getTutorials,
  getTutorialById,
  getAllTutorialsAdmin,
  createTutorial,
  updateTutorial,
  deleteTutorial,
  toggleTutorialStatus,
} = require("../controllers/tutorialController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// PUBLIC ROUTES
// =====================================

// Get all published tutorials
router.get("/", getTutorials);

// =====================================
// ADMIN ROUTES
// =====================================

// Get all tutorials including drafts
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllTutorialsAdmin
);

// Create tutorial
router.post(
  "/admin",
  protect,
  adminOnly,
  createTutorial
);

// Update tutorial
router.put(
  "/admin/:id",
  protect,
  adminOnly,
  updateTutorial
);

// Delete tutorial
router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteTutorial
);

// Publish / Unpublish tutorial
router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  toggleTutorialStatus
);

// Dynamic route LAST
router.get("/:id", getTutorialById);

module.exports = router;