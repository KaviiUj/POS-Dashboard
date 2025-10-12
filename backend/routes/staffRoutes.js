// Staff Routes
const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const {
  createStaffValidation,
  updateStaffValidation,
  updateStaffStatusValidation,
  deleteStaffValidation,
  validate,
} = require('../middleware/validateRequest');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/staff/create
 * @desc    Create new staff
 * @access  Private (Admin only - role 99)
 */
router.post(
  '/create',
  protect,
  authorize(99),
  createStaffValidation,
  validate,
  staffController.createStaff
);

/**
 * @route   POST /api/staff/update
 * @desc    Update staff
 * @access  Private (Admin only - role 99)
 */
router.post(
  '/update',
  protect,
  authorize(99),
  updateStaffValidation,
  validate,
  staffController.updateStaff
);

/**
 * @route   POST /api/staff/status
 * @desc    Activate or Deactivate staff
 * @access  Private (Admin only - role 99)
 */
router.post(
  '/status',
  protect,
  authorize(99),
  updateStaffStatusValidation,
  validate,
  staffController.updateStaffStatus
);

/**
 * @route   POST /api/staff/delete
 * @desc    Delete staff
 * @access  Private (Admin only - role 99)
 */
router.post(
  '/delete',
  protect,
  authorize(99),
  deleteStaffValidation,
  validate,
  staffController.deleteStaff
);

/**
 * @route   GET /api/staff/all
 * @desc    Get all staff
 * @access  Private (Admin only - role 99)
 */
router.get('/all', protect, authorize(99), staffController.getAllStaff);

/**
 * @route   GET /api/staff/active
 * @desc    Get active staff only
 * @access  Private (Admin only - role 99)
 */
router.get('/active', protect, authorize(99), staffController.getActiveStaff);

module.exports = router;

