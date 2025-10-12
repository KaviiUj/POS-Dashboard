// Authentication Routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { signupValidation, validate } = require('../middleware/validateRequest');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', signupValidation, validate, authController.signup);

/**
 * @route   GET /api/auth/profile/:userId
 * @desc    Get user profile by userId
 * @access  Private (will add auth middleware later)
 */
router.get('/profile/:userId', authController.getProfile);

/**
 * @route   GET /api/auth/users
 * @desc    Get all users (Admin only)
 * @access  Private (will add auth middleware later)
 */
router.get('/users', authController.getAllUsers);

module.exports = router;

