const express = require("express");

const {
  getPracticeProblems,
  getPracticeProblemById,
  getAllPracticeAdmin,
  createPracticeProblem,
  updatePracticeProblem,
  deletePracticeProblem,
  togglePracticeStatus,
} = require("../controllers/practiceController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC
router.get("/", getPracticeProblems);

// ADMIN
router.get("/admin/all", protect, adminOnly, getAllPracticeAdmin);
router.post("/admin", protect, adminOnly, createPracticeProblem);
router.put("/admin/:id", protect, adminOnly, updatePracticeProblem);
router.delete("/admin/:id", protect, adminOnly, deletePracticeProblem);
router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  togglePracticeStatus
);

// SINGLE PRACTICE PROBLEM
router.get("/:id", getPracticeProblemById);

module.exports = router;