// Authentication Controller
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * @desc    Register a new user (Signup)
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = async (req, res, next) => {
  try {
    const { userName, passWord, role } = req.body;

    logger.info('Signup attempt', {
      userName,
      role,
      ip: req.ip,
    });

    // Check if user already exists
    const existingUser = await User.findOne({ userName });
    
    if (existingUser) {
      logger.warn('Signup failed: Username already exists', {
        userName,
        ip: req.ip,
      });

      return res.status(400).json({
        success: false,
        message: 'Username already exists',
      });
    }

    // Create new user
    const user = await User.create({
      userName,
      passWord,
      role,
    });

    logger.info('User created successfully', {
      userId: user._id.toString(),
      userName: user.userName,
      role: user.role,
      roleName: user.getRoleName(),
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: user._id,
        userName: user.userName,
        role: user.role,
        roleName: user.getRoleName(),
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logger.error('Signup error', {
      message: error.message,
      stack: error.stack,
      userName: req.body.userName,
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

    // Handle duplicate key error (shouldn't happen due to check above, but just in case)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists',
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile/:userId
 * @access  Private (will implement auth middleware later)
 */
exports.getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    logger.info('Profile request', { userId });

    const user = await User.findById(userId);

    if (!user) {
      logger.warn('User not found', { userId });
      
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    logger.info('Profile retrieved successfully', {
      userId: user._id.toString(),
      userName: user.userName,
    });

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        userName: user.userName,
        role: user.role,
        roleName: user.getRoleName(),
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Get profile error', {
      message: error.message,
      stack: error.stack,
      userId: req.params.userId,
    });

    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
    });
  }
};

/**
 * @desc    Get all users (Admin only - will add auth middleware later)
 * @route   GET /api/auth/users
 * @access  Private (Admin)
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    logger.info('Fetching all users', { requestedBy: req.ip });

    const users = await User.find().sort({ createdAt: -1 });

    logger.info('Users retrieved successfully', {
      count: users.length,
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users.map(user => ({
        userId: user._id,
        userName: user.userName,
        role: user.role,
        roleName: user.getRoleName(),
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (error) {
    logger.error('Get all users error', {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
    });
  }
};

