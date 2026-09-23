const mongoose = require("mongoose");
const Course = require("../models/Course");

// =====================================
// GET ALL PUBLISHED COURSES
// =====================================
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "published" })
      .populate("mentor", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get Courses Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

// =====================================
// GET SINGLE COURSE
// =====================================
const getCourseById = async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const filter = isObjectId
      ? { $or: [{ _id: req.params.id }, { slug: req.params.id }], status: "published" }
      : { slug: req.params.id, status: "published" };

    const course = await Course.findOne(filter).populate(
      "mentor",
      "firstName lastName email"
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Get Course Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
};

// =====================================
// ADMIN - GET ALL COURSES
// =====================================
const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("mentor", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Admin Get Courses Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

// =====================================
// ADMIN - CREATE COURSE
// =====================================
const createCourse = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      language,
      description,
      thumbnail,
      level,
      duration,
      lessonsCount,
      topics,
      lessons,
      prerequisites,
      learningOutcomes,
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

    const existingCourse = await Course.findOne({ slug });

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: "A course with this slug already exists",
      });
    }

    const course = await Course.create({
      title,
      slug,
      category,
      language,
      description,
      thumbnail,
      level,
      duration,
      lessonsCount,
      topics,
      lessons,
      prerequisites,
      learningOutcomes,
      mentor: mentor || null,
      status: status || "draft",
      isFeatured: isFeatured || false,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create Course Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

// =====================================
// ADMIN - UPDATE COURSE
// =====================================
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Update Course Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};

// =====================================
// ADMIN - DELETE COURSE
// =====================================
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete Course Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};

// =====================================
// ADMIN - PUBLISH / UNPUBLISH COURSE
// =====================================
const toggleCourseStatus = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.status =
      course.status === "published" ? "draft" : "published";

    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${
        course.status === "published" ? "published" : "moved to draft"
      } successfully`,
      course,
    });
  } catch (error) {
    console.error("Toggle Course Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to change course status",
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  getAllCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCourseStatus,
};