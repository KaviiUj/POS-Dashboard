// Category Controller
const Category = require('../models/Category');
const logger = require('../utils/logger');

/**
 * @desc    Add new category
 * @route   POST /api/category/add
 * @access  Private (Admin only - role 99)
 */
exports.addCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.body;
    const userId = req.user._id; // From auth middleware
    const userName = req.user.userName;
    const userRole = req.user.role;

    logger.info('Add category attempt', {
      categoryName,
      userId: userId.toString(),
      userName,
      userRole,
      ip: req.ip,
    });

    // Check if user is admin (additional safety check)
    if (userRole !== 99) {
      logger.warn('Unauthorized category creation attempt', {
        userId: userId.toString(),
        userName,
        userRole,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Admin can create categories.',
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ categoryName });

    if (existingCategory) {
      logger.warn('Category creation failed: Category already exists', {
        categoryName,
        userId: userId.toString(),
        userName,
        ip: req.ip,
      });

      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    // Create new category
    const category = await Category.create({
      categoryName,
      createdBy: userId,
    });

    // Populate createdBy field with user details
    await category.populate('createdBy', 'userName role');

    logger.info('Category created successfully', {
      categoryId: category._id.toString(),
      categoryName: category.categoryName,
      createdBy: userId.toString(),
      createdByName: userName,
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        categoryId: category._id,
        categoryName: category.categoryName,
        isActive: category.isActive,
        createdBy: {
          userId: category.createdBy._id,
          userName: category.createdBy.userName,
          role: category.createdBy.role,
        },
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Add category error', {
      message: error.message,
      stack: error.stack,
      categoryName: req.body.categoryName,
      userId: req.user._id.toString(),
    });

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      message: 'Server error while creating category',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Get all categories
 * @route   GET /api/category/all
 * @access  Private (Admin only)
 */
exports.getAllCategories = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userName = req.user.userName;

    logger.info('Fetching all categories', {
      requestedBy: userId.toString(),
      userName,
    });

    const categories = await Category.find()
      .populate('createdBy', 'userName role')
      .populate('updatedBy', 'userName role')
      .sort({ createdAt: -1 });

    logger.info('Categories retrieved successfully', {
      count: categories.length,
      requestedBy: userId.toString(),
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories.map((category) => ({
        categoryId: category._id,
        categoryName: category.categoryName,
        isActive: category.isActive,
        createdBy: category.createdBy
          ? {
              userId: category.createdBy._id,
              userName: category.createdBy.userName,
            }
          : null,
        updatedBy: category.updatedBy
          ? {
              userId: category.updatedBy._id,
              userName: category.updatedBy.userName,
            }
          : null,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      })),
    });
  } catch (error) {
    logger.error('Get all categories error', {
      message: error.message,
      stack: error.stack,
      userId: req.user._id.toString(),
    });

    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
    });
  }
};

/**
 * @desc    Update category
 * @route   POST /api/category/update
 * @access  Private (Admin only - role 99)
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const { categoryId, categoryName } = req.body;
    const userId = req.user._id;
    const userName = req.user.userName;
    const userRole = req.user.role;

    logger.info('Update category attempt', {
      categoryId,
      categoryName,
      userId: userId.toString(),
      userName,
      userRole,
      ip: req.ip,
    });

    // Check if user is admin
    if (userRole !== 99) {
      logger.warn('Unauthorized category update attempt', {
        userId: userId.toString(),
        userName,
        userRole,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Admin can update categories.',
      });
    }

    // Find category
    const category = await Category.findById(categoryId);

    if (!category) {
      logger.warn('Update failed: Category not found', {
        categoryId,
        userId: userId.toString(),
        ip: req.ip,
      });

      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if new category name already exists (excluding current category)
    if (categoryName !== category.categoryName) {
      const existingCategory = await Category.findOne({
        categoryName,
        _id: { $ne: categoryId },
      });

      if (existingCategory) {
        logger.warn('Update failed: Category name already exists', {
          categoryName,
          categoryId,
          userId: userId.toString(),
          ip: req.ip,
        });

        return res.status(400).json({
          success: false,
          message: 'Category name already exists',
        });
      }
    }

    // Store old name for logging
    const oldCategoryName = category.categoryName;

    // Update category
    category.categoryName = categoryName;
    category.updatedBy = userId;
    await category.save();

    // Populate user details
    await category.populate('createdBy updatedBy', 'userName role');

    logger.info('Category updated successfully', {
      categoryId: category._id.toString(),
      oldName: oldCategoryName,
      newName: category.categoryName,
      updatedBy: userId.toString(),
      updatedByName: userName,
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: {
        categoryId: category._id,
        categoryName: category.categoryName,
        isActive: category.isActive,
        createdBy: category.createdBy
          ? {
              userId: category.createdBy._id,
              userName: category.createdBy.userName,
            }
          : null,
        updatedBy: category.updatedBy
          ? {
              userId: category.updatedBy._id,
              userName: category.updatedBy.userName,
            }
          : null,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Update category error', {
      message: error.message,
      stack: error.stack,
      categoryId: req.body.categoryId,
      userId: req.user._id.toString(),
    });

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating category',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Activate or Deactivate category
 * @route   POST /api/category/status
 * @access  Private (Admin only - role 99)
 */
exports.updateCategoryStatus = async (req, res, next) => {
  try {
    const { categoryId, isActive } = req.body;
    const userId = req.user._id;
    const userName = req.user.userName;
    const userRole = req.user.role;

    logger.info('Update category status attempt', {
      categoryId,
      isActive,
      userId: userId.toString(),
      userName,
      userRole,
      ip: req.ip,
    });

    // Check if user is admin
    if (userRole !== 99) {
      logger.warn('Unauthorized category status update attempt', {
        userId: userId.toString(),
        userName,
        userRole,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Admin can update category status.',
      });
    }

    // Find category
    const category = await Category.findById(categoryId);

    if (!category) {
      logger.warn('Status update failed: Category not found', {
        categoryId,
        userId: userId.toString(),
        ip: req.ip,
      });

      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Store old status for logging
    const oldStatus = category.isActive;

    // Update status
    category.isActive = isActive;
    category.updatedBy = userId;
    await category.save();

    // Populate user details
    await category.populate('updatedBy', 'userName role');

    logger.info('Category status updated successfully', {
      categoryId: category._id.toString(),
      categoryName: category.categoryName,
      oldStatus,
      newStatus: category.isActive,
      updatedBy: userId.toString(),
      updatedByName: userName,
    });

    res.status(200).json({
      success: true,
      message: `Category ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        categoryId: category._id,
        categoryName: category.categoryName,
        isActive: category.isActive,
        updatedBy: category.updatedBy
          ? {
              userId: category.updatedBy._id,
              userName: category.updatedBy.userName,
            }
          : null,
        updatedAt: category.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Update category status error', {
      message: error.message,
      stack: error.stack,
      categoryId: req.body.categoryId,
      userId: req.user._id.toString(),
    });

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating category status',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Get active categories only
 * @route   GET /api/category/active
 * @access  Private (Admin only)
 */
exports.getActiveCategories = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userName = req.user.userName;

    logger.info('Fetching active categories', {
      requestedBy: userId.toString(),
      userName,
    });

    const categories = await Category.find({ isActive: true })
      .populate('createdBy', 'userName role')
      .sort({ categoryName: 1 });

    logger.info('Active categories retrieved successfully', {
      count: categories.length,
      requestedBy: userId.toString(),
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories.map((category) => ({
        categoryId: category._id,
        categoryName: category.categoryName,
        createdAt: category.createdAt,
      })),
    });
  } catch (error) {
    logger.error('Get active categories error', {
      message: error.message,
      stack: error.stack,
      userId: req.user._id.toString(),
    });

    res.status(500).json({
      success: false,
      message: 'Server error while fetching active categories',
    });
  }
};

