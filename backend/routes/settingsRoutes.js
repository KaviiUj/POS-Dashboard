// Settings Routes
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const {
  updateSettingsValidation,
  validate,
} = require('../middleware/validateRequest');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/settings
 * @desc    Get settings
 * @access  Private
 */
router.get('/', protect, settingsController.getSettings);

/**
 * @route   POST /api/settings/update
 * @desc    Update settings
 * @access  Private (Admin only - role 99)
 */
router.post(
  '/update',
  protect,
  authorize(99),
  updateSettingsValidation,
  validate,
  settingsController.updateSettings
);

module.exports = router;

