const Language = require("../models/Language");

// GET ALL PUBLISHED LANGUAGES
const getLanguages = async (req, res) => {
  try {
    const languages = await Language.find({
      status: "published",
    }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: languages.length,
      languages,
    });
  } catch (error) {
    console.error("Get Languages Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch languages",
    });
  }
};

// GET SINGLE LANGUAGE
const getLanguageById = async (req, res) => {
  try {
    const language = await Language.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id },
      ],
      status: "published",
    });

    if (!language) {
      return res.status(404).json({
        success: false,
        message: "Language not found",
      });
    }

    res.status(200).json({
      success: true,
      language,
    });
  } catch (error) {
    console.error("Get Language Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch language",
    });
  }
};

// ADMIN - GET ALL LANGUAGES
const getAllLanguagesAdmin = async (req, res) => {
  try {
    const languages = await Language.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: languages.length,
      languages,
    });
  } catch (error) {
    console.error("Admin Get Languages Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch languages",
    });
  }
};

// ADMIN - CREATE LANGUAGE
const createLanguage = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      icon,
      color,
      category,
      order,
      status,
      isFeatured,
      coursesCount,
      tutorialsCount,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Language name and slug are required",
      });
    }

    const existingLanguage = await Language.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingLanguage) {
      return res.status(409).json({
        success: false,
        message: "A language with this name or slug already exists",
      });
    }

    const language = await Language.create({
      name,
      slug,
      description,
      icon,
      color,
      category: category || "Programming",
      order: order || 0,
      status: status || "draft",
      isFeatured: isFeatured || false,
      coursesCount: coursesCount || 0,
      tutorialsCount: tutorialsCount || 0,
    });

    res.status(201).json({
      success: true,
      message: "Language created successfully",
      language,
    });
  } catch (error) {
    console.error("Create Language Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create language",
    });
  }
};

// ADMIN - UPDATE LANGUAGE
const updateLanguage = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);

    if (!language) {
      return res.status(404).json({
        success: false,
        message: "Language not found",
      });
    }

    const updatedLanguage = await Language.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Language updated successfully",
      language: updatedLanguage,
    });
  } catch (error) {
    console.error("Update Language Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update language",
    });
  }
};

// ADMIN - DELETE LANGUAGE
const deleteLanguage = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);

    if (!language) {
      return res.status(404).json({
        success: false,
        message: "Language not found",
      });
    }

    await Language.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Language deleted successfully",
    });
  } catch (error) {
    console.error("Delete Language Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete language",
    });
  }
};

// ADMIN - TOGGLE LANGUAGE STATUS
const toggleLanguageStatus = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);

    if (!language) {
      return res.status(404).json({
        success: false,
        message: "Language not found",
      });
    }

    language.status =
      language.status === "published"
        ? "draft"
        : "published";

    await language.save();

    res.status(200).json({
      success: true,
      message: `Language ${
        language.status === "published"
          ? "published"
          : "moved to draft"
      } successfully`,
      language,
    });
  } catch (error) {
    console.error("Toggle Language Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to change language status",
    });
  }
};

module.exports = {
  getLanguages,
  getLanguageById,
  getAllLanguagesAdmin,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  toggleLanguageStatus,
};