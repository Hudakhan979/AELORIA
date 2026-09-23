const express = require("express");

const {
  getCourses,
  getCourseById,
  getAllCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCourseStatus,
} = require("../controllers/courseController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// PUBLIC ROUTES
// =====================================

// Get all published courses
router.get("/", getCourses);

// Get single published course
router.get("/:id", getCourseById);

// =====================================
// ADMIN ROUTES
// =====================================

// Get all courses including drafts
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllCoursesAdmin
);

// Create course
router.post(
  "/admin",
  protect,
  adminOnly,
  createCourse
);

// Update course
router.put(
  "/admin/:id",
  protect,
  adminOnly,
  updateCourse
);

// Delete course
router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteCourse
);

// Publish / Unpublish course
router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  toggleCourseStatus
);

module.exports = router;