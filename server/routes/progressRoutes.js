const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getCourseProgress,
  toggleLessonCompletion,
  updateLastAccessedLesson,
  getAllStudentProgress,
  getAdminProgressOverview,
} = require("../controllers/progressController");

// Student progress routes (require student authentication)
router.get("/my-progress", protect, getAllStudentProgress);
router.get("/course/:courseId", protect, getCourseProgress);
router.post("/course/:courseId/toggle-lesson", protect, toggleLessonCompletion);
router.post("/course/:courseId/last-accessed", protect, updateLastAccessedLesson);

// Admin progress overview route
router.get("/admin/overview", protect, adminOnly, getAdminProgressOverview);

module.exports = router;
