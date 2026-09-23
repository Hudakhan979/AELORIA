const mongoose = require("mongoose");
const Note = require("../models/Note");

// GET ALL PUBLISHED NOTES
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ status: "published" })
      .populate("mentor", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error("Get Notes Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
    });
  }
};

// GET SINGLE NOTE
const getNoteById = async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const filter = isObjectId
      ? { $or: [{ _id: req.params.id }, { slug: req.params.id }], status: "published" }
      : { slug: req.params.id, status: "published" };

    const note = await Note.findOne(filter).populate(
      "mentor",
      "firstName lastName email"
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    note.views += 1;
    await note.save();

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("Get Note Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch note",
    });
  }
};

// ADMIN - GET ALL NOTES
const getAllNotesAdmin = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("mentor", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error("Admin Get Notes Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
    });
  }
};

// ADMIN - CREATE NOTE
const createNote = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      language,
      description,
      content,
      pdfUrl,
      thumbnail,
      tags,
      mentor,
      status,
      isFeatured,
    } = req.body;

    if (!title || !slug || !category || !description || !content) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, category, description and content are required",
      });
    }

    const existingNote = await Note.findOne({ slug });

    if (existingNote) {
      return res.status(409).json({
        success: false,
        message: "A note with this slug already exists",
      });
    }

    const note = await Note.create({
      title,
      slug,
      category,
      language,
      description,
      content,
      pdfUrl,
      thumbnail,
      tags,
      mentor: mentor || null,
      status: status || "draft",
      isFeatured: isFeatured || false,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Create Note Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create note",
    });
  }
};

// ADMIN - UPDATE NOTE
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    console.error("Update Note Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update note",
    });
  }
};

// ADMIN - DELETE NOTE
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete Note Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete note",
    });
  }
};

// ADMIN - TOGGLE NOTE STATUS
const toggleNoteStatus = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    note.status =
      note.status === "published"
        ? "draft"
        : "published";

    await note.save();

    res.status(200).json({
      success: true,
      message: `Note ${
        note.status === "published"
          ? "published"
          : "moved to draft"
      } successfully`,
      note,
    });
  } catch (error) {
    console.error("Toggle Note Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to change note status",
    });
  }
};

module.exports = {
  getNotes,
  getNoteById,
  getAllNotesAdmin,
  createNote,
  updateNote,
  deleteNote,
  toggleNoteStatus,
};