const mongoose = require("mongoose");
const Practice = require("../models/Practice");

// GET ALL PUBLISHED PRACTICE PROBLEMS
const getPracticeProblems = async (req, res) => {
  try {
    const problems = await Practice.find({ status: "published" })
      .populate("mentor", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    console.error("Get Practice Problems Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch practice problems",
    });
  }
};

// GET SINGLE PRACTICE PROBLEM
const getPracticeProblemById = async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const filter = isObjectId
      ? { $or: [{ _id: req.params.id }, { slug: req.params.id }], status: "published" }
      : { slug: req.params.id, status: "published" };

    const problem = await Practice.findOne(filter).populate(
      "mentor",
      "firstName lastName email"
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Practice problem not found",
      });
    }

    problem.attempts += 1;
    await problem.save();

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    console.error("Get Practice Problem Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch practice problem",
    });
  }
};

// ADMIN - GET ALL PRACTICE PROBLEMS
const getAllPracticeAdmin = async (req, res) => {
  try {
    const problems = await Practice.find()
      .populate("mentor", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    console.error("Admin Get Practice Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch practice problems",
    });
  }
};

// ADMIN - CREATE PRACTICE PROBLEM
const createPracticeProblem = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      topic,
      difficulty,
      description,
      constraints,
      inputFormat,
      outputFormat,
      exampleInput,
      exampleOutput,
      explanation,
      supportedLanguages,
      starterCode,
      solution,
      testCases,
      hints,
      mentor,
      status,
      isFeatured,
    } = req.body;

    if (!title || !slug || !category || !topic || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, category, topic and description are required",
      });
    }

    const existingProblem = await Practice.findOne({ slug });

    if (existingProblem) {
      return res.status(409).json({
        success: false,
        message: "A practice problem with this slug already exists",
      });
    }

    const problem = await Practice.create({
      title,
      slug,
      category,
      topic,
      difficulty: difficulty || "Easy",
      description,
      constraints,
      inputFormat,
      outputFormat,
      exampleInput,
      exampleOutput,
      explanation,
      supportedLanguages,
      starterCode,
      solution,
      testCases,
      hints,
      mentor: mentor || null,
      status: status || "draft",
      isFeatured: isFeatured || false,
    });

    res.status(201).json({
      success: true,
      message: "Practice problem created successfully",
      problem,
    });
  } catch (error) {
    console.error("Create Practice Problem Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create practice problem",
    });
  }
};

// ADMIN - UPDATE PRACTICE PROBLEM
const updatePracticeProblem = async (req, res) => {
  try {
    const problem = await Practice.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Practice problem not found",
      });
    }

    const updatedProblem = await Practice.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Practice problem updated successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.error("Update Practice Problem Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update practice problem",
    });
  }
};

// ADMIN - DELETE PRACTICE PROBLEM
const deletePracticeProblem = async (req, res) => {
  try {
    const problem = await Practice.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Practice problem not found",
      });
    }

    await Practice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Practice problem deleted successfully",
    });
  } catch (error) {
    console.error("Delete Practice Problem Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete practice problem",
    });
  }
};

// ADMIN - TOGGLE PRACTICE STATUS
const togglePracticeStatus = async (req, res) => {
  try {
    const problem = await Practice.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Practice problem not found",
      });
    }

    problem.status =
      problem.status === "published"
        ? "draft"
        : "published";

    await problem.save();

    res.status(200).json({
      success: true,
      message: `Practice problem ${
        problem.status === "published"
          ? "published"
          : "moved to draft"
      } successfully`,
      problem,
    });
  } catch (error) {
    console.error("Toggle Practice Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to change practice problem status",
    });
  }
};

module.exports = {
  getPracticeProblems,
  getPracticeProblemById,
  getAllPracticeAdmin,
  createPracticeProblem,
  updatePracticeProblem,
  deletePracticeProblem,
  togglePracticeStatus,
};