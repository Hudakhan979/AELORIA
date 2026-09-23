const express = require("express");

const {
  getNotes,
  getNoteById,
  getAllNotesAdmin,
  createNote,
  updateNote,
  deleteNote,
  toggleNoteStatus,
} = require("../controllers/noteController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC
router.get("/", getNotes);

// ADMIN
router.get("/admin/all", protect, adminOnly, getAllNotesAdmin);
router.post("/admin", protect, adminOnly, createNote);
router.put("/admin/:id", protect, adminOnly, updateNote);
router.delete("/admin/:id", protect, adminOnly, deleteNote);
router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  toggleNoteStatus
);

// SINGLE NOTE
router.get("/:id", getNoteById);

module.exports = router;