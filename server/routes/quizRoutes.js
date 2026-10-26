const express = require("express");
const router = express.Router();
const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const {
  getAllQuizzesAdmin,
  getQuizByIdAdmin,
  createQuizAdmin,
  updateQuizAdmin,
  deleteQuizAdmin,
  toggleQuizStatusAdmin,
  addQuestionAdmin,
  updateQuestionAdmin,
  deleteQuestionAdmin,
  getQuizAttemptsAdmin,
  getQuizzesByCourse,
  getAllPublishedQuizzes,
  getQuizInfo,
  startQuiz,
  submitQuiz,
  getMyAttempts,
  getAttemptById,
} = require("../controllers/quizController");

// ==========================================
// ADMIN ROUTES
// ==========================================
router.get("/admin/all", protect, adminOnly, getAllQuizzesAdmin);
router.post("/admin", protect, adminOnly, createQuizAdmin);
router.get("/admin/:id", protect, adminOnly, getQuizByIdAdmin);
router.put("/admin/:id", protect, adminOnly, updateQuizAdmin);
router.delete("/admin/:id", protect, adminOnly, deleteQuizAdmin);
router.patch("/admin/:id/status", protect, adminOnly, toggleQuizStatusAdmin);
router.post("/admin/:id/questions", protect, adminOnly, addQuestionAdmin);
router.put("/admin/:id/questions/:questionId", protect, adminOnly, updateQuestionAdmin);
router.delete("/admin/:id/questions/:questionId", protect, adminOnly, deleteQuestionAdmin);
router.get("/admin/:id/attempts", protect, adminOnly, getQuizAttemptsAdmin);

// ==========================================
// PUBLIC & STUDENT ROUTES
// ==========================================
router.get("/course/:courseId", getQuizzesByCourse);
router.get("/", getAllPublishedQuizzes);
router.get("/attempts/:attemptId", protect, getAttemptById);
router.get("/:id", getQuizInfo);
router.get("/:id/take", protect, startQuiz);
router.post("/:id/submit", protect, submitQuiz);
router.get("/:id/my-attempts", protect, getMyAttempts);

module.exports = router;
