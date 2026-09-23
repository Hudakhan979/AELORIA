const Category = require("../models/Category");

// GET ALL PUBLISHED CATEGORIES
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      status: "published",
    }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// GET SINGLE CATEGORY
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id },
      ],
      status: "published",
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get Category Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

// ADMIN - GET ALL CATEGORIES
const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Admin Get Categories Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// ADMIN - CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      icon,
      image,
      type,
      order,
      status,
      isFeatured,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Category name and slug are required",
      });
    }

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "A category with this name or slug already exists",
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      icon,
      image,
      type: type || "other",
      order: order || 0,
      status: status || "draft",
      isFeatured: isFeatured || false,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

// ADMIN - UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

// ADMIN - DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};

// ADMIN - TOGGLE CATEGORY STATUS
const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.status =
      category.status === "published"
        ? "draft"
        : "published";

    await category.save();

    res.status(200).json({
      success: true,
      message: `Category ${
        category.status === "published"
          ? "published"
          : "moved to draft"
      } successfully`,
      category,
    });
  } catch (error) {
    console.error("Toggle Category Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to change category status",
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
};