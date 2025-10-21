// Settings Controller
const Settings = require('../models/Settings');
const logger = require('../utils/logger');

/**
 * @desc    Get settings
 * @route   GET /api/settings
 * @access  Private
 */
exports.getSettings = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userName = req.user.userName;

    logger.info('Fetching settings', {
      requestedBy: userId.toString(),
      userName,
    });

    // Get or create settings (singleton pattern)
    const settings = await Settings.getSettings();

    logger.info('Settings retrieved successfully', {
      requestedBy: userId.toString(),
    });

    res.status(200).json({
      success: true,
      data: {
        settingsId: settings._id,
        logo: settings.logo,
        showCuisineFilter: settings.showCuisineFilter,
        showModifiers: settings.showModifiers,
        showModifiersPrice: settings.showModifiersPrice,
        outletName: settings.outletName,
        outletCurrency: settings.outletCurrency,
        updatedBy: settings.updatedBy,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Get settings error', {
      message: error.message,
      stack: error.stack,
      userId: req.user._id.toString(),
    });

    res.status(500).json({
      success: false,
      message: 'Server error while fetching settings',
    });
  }
};

/**
 * @desc    Update settings
 * @route   POST /api/settings/update
 * @access  Private (Admin only - role 99)
 */
exports.updateSettings = async (req, res, next) => {
  try {
    const { logo, showCuisineFilter, showModifiers, showModifiersPrice, outletName, outletCurrency } = req.body;
    const userId = req.user._id;
    const userName = req.user.userName;
    const userRole = req.user.role;

    logger.info('Update settings attempt', {
      logo,
      showCuisineFilter,
      showModifiers,
      showModifiersPrice,
      outletName,
      outletCurrency,
      userId: userId.toString(),
      userName,
      userRole,
      ip: req.ip,
    });

    // Check if user is admin
    if (userRole !== 99) {
      logger.warn('Unauthorized settings update attempt', {
        userId: userId.toString(),
        userName,
        userRole,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Admin can update settings.',
      });
    }

    // Get or create settings
    const settings = await Settings.getSettings();

    // Store old values for logging
    const oldValues = {
      logo: settings.logo,
      showCuisineFilter: settings.showCuisineFilter,
      showModifiers: settings.showModifiers,
      showModifiersPrice: settings.showModifiersPrice,
      outletName: settings.outletName,
      outletCurrency: settings.outletCurrency,
    };

    // Update settings - only update fields that are provided
    if (logo !== undefined) {
      settings.logo = logo;
    }
    if (showCuisineFilter !== undefined) {
      settings.showCuisineFilter = showCuisineFilter;
    }
    if (showModifiers !== undefined) {
      settings.showModifiers = showModifiers;
    }
    if (showModifiersPrice !== undefined) {
      settings.showModifiersPrice = showModifiersPrice;
    }
    if (outletName !== undefined) {
      settings.outletName = outletName;
    }
    if (outletCurrency !== undefined) {
      settings.outletCurrency = outletCurrency;
    }
    settings.updatedBy = userId;

    await settings.save();

    // Populate user details
    await settings.populate('updatedBy', 'userName role');

    logger.info('Settings updated successfully', {
      settingsId: settings._id.toString(),
      oldValues,
      newValues: {
        logo: settings.logo,
        showCuisineFilter: settings.showCuisineFilter,
        showModifiers: settings.showModifiers,
        showModifiersPrice: settings.showModifiersPrice,
        outletName: settings.outletName,
        outletCurrency: settings.outletCurrency,
      },
      updatedBy: userId.toString(),
      updatedByName: userName,
    });

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        settingsId: settings._id,
        logo: settings.logo,
        showCuisineFilter: settings.showCuisineFilter,
        showModifiers: settings.showModifiers,
        showModifiersPrice: settings.showModifiersPrice,
        outletName: settings.outletName,
        outletCurrency: settings.outletCurrency,
        updatedBy: settings.updatedBy
          ? {
              userId: settings.updatedBy._id,
              userName: settings.updatedBy.userName,
            }
          : null,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Update settings error', {
      message: error.message,
      stack: error.stack,
      userId: req.user._id.toString(),
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

    res.status(500).json({
      success: false,
      message: 'Server error while updating settings',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

