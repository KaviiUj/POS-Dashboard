// Request Validation Middleware
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Validation rules for user signup
 */
exports.signupValidation = [
  body('userName')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),

  body('passWord')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isInt()
    .withMessage('Role must be a number')
    .custom((value) => {
      if (value !== 99 && value !== 89) {
        throw new Error('Role must be either 99 (Admin) or 89 (Staff)');
      }
      return true;
    }),
];

/**
 * Middleware to check validation results
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    logger.warn('Validation failed', {
      errors: errorMessages,
      body: { ...req.body, passWord: '***HIDDEN***' },
      ip: req.ip,
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages,
    });
  }

  next();
};

/**
 * Validation rules for user login
 */
exports.loginValidation = [
  body('userName')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),

  body('passWord')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Validation for userId parameter
 */
exports.userIdValidation = [
  body('userId')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('User ID cannot be empty'),
];

