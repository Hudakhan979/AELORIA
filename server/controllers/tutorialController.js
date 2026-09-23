const mongoose = require("mongoose");
const Tutorial = require("../models/Tutorial");

// =====================================
// GET ALL PUBLISHED TUTORIALS
// =====================================
const getTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.find({ status: "published" })
      .populate("mentor", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tutorials.length,
      tutorials,
    });
  } catch (error) {
    console.error("Get Tutorials Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tutorials",
    });
  }
};

// =====================================
// GET SINGLE TUTORIAL
// =====================================
const getTutorialById = async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const filter = isObjectId
      ? { $or: [{ _id: req.params.id }, { slug: req.params.id }], status: "published" }
      : { slug: req.params.id, status: "published" };

    const tutorial = await Tutorial.findOne(filter).populate(
      "mentor",
      "firstName lastName email"
    );

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: "Tutorial not found",
      });
    }

    // Increase views
    tutorial.views += 1;
    await tutorial.save();

    res.status(200).json({
      success: true,
      tutorial,
    });
  } catch (error) {
    console.error("Get Tutorial Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tutorial",
    });
  }
};

// =====================================
// ADMIN - GET ALL TUTORIALS
// =====================================
const getAllTutorialsAdmin = async (req, res) => {
  try {
    const tutorials = await Tutorial.find()
      .populate("mentor", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tutorials.length,
      tutorials,
    });
  } catch (error) {
    console.error("Admin Get Tutorials Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tutorials",
    });
  }
};

// =====================================
// ADMIN - CREATE TUTORIAL
// =====================================
const createTutorial = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      description,
      thumbnail,
      level,
      topics,
      prerequisites,
      keyConcepts,
      mentor,
      status,
      isFeatured,
    } = req.body;

    if (!title || !slug || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, category and description are required",
      });
    }

    const existingTutorial = await Tutorial.findOne({ slug });

    if (existingTutorial) {
      return res.status(409).json({
        success: false,
        message: "A tutorial with this slug already exists",
      });
    }

    const tutorial = await Tutorial.create({
      title,
      slug,
      category,
      description,
      thumbnail,
      level,
      topics,
      prerequisites,
      keyConcepts,
      mentor: mentor || null,
      status: status || "draft",
      isFeatured: isFeatured || false,
    });

    res.status(201).json({
      success: true,
      message: "Tutorial created successfully",
      tutorial,
    });
  } catch (error) {
    console.error("Create Tutorial Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create tutorial",
    });
  }
};

// =====================================
// ADMIN - UPDATE TUTORIAL
// =====================================
const updateTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: "Tutorial not found",
      });
    }

    const updatedTutorial = await Tutorial.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Tutorial updated successfully",
      tutorial: updatedTutorial,
    });
  } catch (error) {
    console.error("Update Tutorial Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update tutorial",
    });
  }
};

// =====================================
// ADMIN - DELETE TUTORIAL
// =====================================
const deleteTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: "Tutorial not found",
      });
    }

    await Tutorial.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Tutorial deleted successfully",
    });
  } catch (error) {
    console.error("Delete Tutorial Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete tutorial",
    });
  }
};

// =====================================
// ADMIN - PUBLISH / UNPUBLISH
// =====================================
const toggleTutorialStatus = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: "Tutorial not found",
      });
    }

    tutorial.status =
      tutorial.status === "published" ? "draft" : "published";

    await tutorial.save();

    res.status(200).json({
      success: true,
      message: `Tutorial ${
        tutorial.status === "published"
          ? "published"
          : "moved to draft"
      } successfully`,
      tutorial,
    });
  } catch (error) {
    console.error("Toggle Tutorial Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to change tutorial status",
    });
  }
};

module.exports = {
  getTutorials,
  getTutorialById,
  getAllTutorialsAdmin,
  createTutorial,
  updateTutorial,
  deleteTutorial,
  toggleTutorialStatus,
};