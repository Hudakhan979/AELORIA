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
    const targetSlug = req.params.id;
    const slugFilter =
      targetSlug === "python-notes" || targetSlug === "python-programming-notes"
        ? { $in: ["python-notes", "python-programming-notes"] }
        : targetSlug;

    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const filter = isObjectId
      ? { $or: [{ _id: req.params.id }, { slug: slugFilter }], status: "published" }
      : { slug: slugFilter, status: "published" };

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

    const finalSlug = (slug || title || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const noteContent = content || description || `# ${title}`;

    if (!title || !finalSlug || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, category and description are required",
      });
    }

    const existingNote = await Note.findOne({
      $or: [
        { slug: finalSlug },
        { title: new RegExp(`^${title.trim()}$`, "i") },
      ],
    });

    if (existingNote) {
      return res.status(409).json({
        success: false,
        message: "A note with this title or slug already exists",
      });
    }

    const note = await Note.create({
      title: title.trim(),
      slug: finalSlug,
      category: category.trim(),
      language: language ? language.trim() : category.trim(),
      description: description.trim(),
      content: noteContent,
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