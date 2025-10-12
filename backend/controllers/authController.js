// Authentication Controller
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

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
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { userName, passWord } = req.body;

    logger.info('Login attempt', {
      userName,
      ip: req.ip,
    });

    // Check if user exists and select password field
    const user = await User.findOne({ userName }).select('+passWord');

    if (!user) {
      logger.warn('Login failed: User not found', {
        userName,
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      logger.warn('Login failed: User account is inactive', {
        userName,
        userId: user._id.toString(),
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact administrator.',
      });
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(passWord);

    if (!isPasswordMatch) {
      logger.warn('Login failed: Invalid password', {
        userName,
        userId: user._id.toString(),
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        userName: user.userName,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '7d',
      }
    );

    logger.info('Login successful', {
      userId: user._id.toString(),
      userName: user.userName,
      role: user.role,
      roleName: user.getRoleName(),
      ip: req.ip,
    });

    // Return success response with token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        userId: user._id,
        userName: user.userName,
        role: user.role,
        roleName: user.getRoleName(),
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logger.error('Login error', {
      message: error.message,
      stack: error.stack,
      userName: req.body.userName,
    });

    res.status(500).json({
      success: false,
      message: 'Server error during login',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Logout user
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res, next) => {
  try {
    const token = req.token; // From auth middleware
    const userId = req.user._id;
    const userName = req.user.userName;

    logger.info('Logout attempt', {
      userId: userId.toString(),
      userName,
      ip: req.ip,
    });

    // Decode token to get expiration time
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    // Add token to blacklist
    await TokenBlacklist.create({
      token,
      userId,
      reason: 'logout',
      expiresAt,
    });

    logger.info('Logout successful - Token blacklisted', {
      userId: userId.toString(),
      userName,
      tokenExpiresAt: expiresAt,
      ip: req.ip,
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    // If token already blacklisted (duplicate key error)
    if (error.code === 11000) {
      logger.warn('Token already blacklisted', {
        userId: req.user._id.toString(),
        userName: req.user.userName,
      });

      return res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    }

    logger.error('Logout error', {
      message: error.message,
      stack: error.stack,
      userId: req.user._id.toString(),
    });

    res.status(500).json({
      success: false,
      message: 'Server error during logout',
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

