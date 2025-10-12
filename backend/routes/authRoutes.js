// Authentication Routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { signupValidation, loginValidation, validate } = require('../middleware/validateRequest');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', signupValidation, validate, authController.signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get access token
 * @access  Public
 */
router.post('/login', loginValidation, validate, authController.login);

/**
 * @route   GET /api/auth/logout
 * @desc    Logout user and invalidate token
 * @access  Private
 */
router.get('/logout', protect, authController.logout);

/**
 * @route   GET /api/auth/profile/:userId
 * @desc    Get user profile by userId
 * @access  Private
 */
router.get('/profile/:userId', protect, authController.getProfile);

/**
 * @route   GET /api/auth/users
 * @desc    Get all users (Admin only)
 * @access  Private (Admin only)
 */
router.get('/users', protect, authorize(99), authController.getAllUsers);

module.exports = router;

