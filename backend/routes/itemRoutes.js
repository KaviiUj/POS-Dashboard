// Item Routes
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const {
  addItemValidation,
  updateItemValidation,
  updateItemStatusValidation,
  deleteItemValidation,
  validate,
} = require('../middleware/validateRequest');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/item/add
 * @desc    Add new item
 * @access  Private (Admin only - role 99)
 */
router.post(
  '/add',
  protect,
  authorize(99),
  addItemValidation,
  validate,
  itemController.addItem
);

/**
 * @route   POST /api/item/update
 * @desc    Update item
 * @access  Private (Admin only - role 99)
 */
router.post(
  '/update',
  protect,
  authorize(99),
  updateItemValidation,
  validate,
  itemController.updateItem
);

/**
 * @route   POST /api/item/status
 * @desc    Activate or Deactivate item
 * @access  Private (Admin only - role 99)
 */
router.post(
  '/status',
  protect,
  authorize(99),
  updateItemStatusValidation,
  validate,
  itemController.updateItemStatus
);

/**
 * @route   POST /api/item/delete
 * @desc    Delete item
 * @access  Private (Admin only - role 99)
 */
router.post(
  '/delete',
  protect,
  authorize(99),
  deleteItemValidation,
  validate,
  itemController.deleteItem
);

/**
 * @route   GET /api/item/all
 * @desc    Get all items
 * @access  Private (Admin only - role 99)
 */
router.get('/all', protect, authorize(99), itemController.getAllItems);

/**
 * @route   GET /api/item/category?categoryId=xxx
 * @desc    Get items by category
 * @access  Private (Admin only - role 99)
 */
router.get('/category', protect, authorize(99), itemController.getItemsByCategory);

/**
 * @route   GET /api/item/active
 * @desc    Get active items only
 * @access  Private (Admin only - role 99)
 */
router.get('/active', protect, authorize(99), itemController.getActiveItems);

module.exports = router;

