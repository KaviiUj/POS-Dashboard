// Category Routes
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const {
  addCategoryValidation,
  updateCategoryValidation,
  updateCategoryStatusValidation,
  validate,
} = require('../middleware/validateRequest');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/category/add
 * @desc    Add new category
 * @access  Private (Admin only - role 99)
 */
router.post(
  '/add',
  protect,
  authorize(99),
  addCategoryValidation,
  validate,
  categoryController.addCategory
);

/**
 * @route   POST /api/category/update
 * @desc    Update category
 * @access  Private (Admin only - role 99)
 */
router.post(
  '/update',
  protect,
  authorize(99),
  updateCategoryValidation,
  validate,
  categoryController.updateCategory
);

/**
 * @route   POST /api/category/status
 * @desc    Activate or Deactivate category
 * @access  Private (Admin only - role 99)
 */
router.post(
  '/status',
  protect,
  authorize(99),
  updateCategoryStatusValidation,
  validate,
  categoryController.updateCategoryStatus
);

/**
 * @route   GET /api/category/all
 * @desc    Get all categories
 * @access  Private (Admin only - role 99)
 */
router.get('/all', protect, authorize(99), categoryController.getAllCategories);

/**
 * @route   GET /api/category/active
 * @desc    Get active categories only
 * @access  Private (Admin only - role 99)
 */
router.get('/active', protect, authorize(99), categoryController.getActiveCategories);

module.exports = router;

