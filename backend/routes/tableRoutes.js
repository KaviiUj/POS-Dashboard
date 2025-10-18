// Table Routes
const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const {
  createTableValidation,
  deleteTableValidation,
  validate,
} = require('../middleware/validateRequest');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/table/create
 * @desc    Create new table
 * @access  Private (Admin only - role 99)
 */
router.post(
  '/create',
  protect,
  authorize(99),
  createTableValidation,
  validate,
  tableController.createTable
);

/**
 * @route   POST /api/table/delete
 * @desc    Delete table
 * @access  Private (Admin only - role 99)
 */
router.post(
  '/delete',
  protect,
  authorize(99),
  deleteTableValidation,
  validate,
  tableController.deleteTable
);

/**
 * @route   GET /api/table/all
 * @desc    Get all tables
 * @access  Private (Admin only - role 99)
 */
router.get('/all', protect, authorize(99), tableController.getAllTables);

/**
 * @route   GET /api/table/available
 * @desc    Get available tables only
 * @access  Private
 */
router.get('/available', protect, tableController.getAvailableTables);

module.exports = router;

