// Staff Controller
const Staff = require('../models/Staff');
const logger = require('../utils/logger');

/**
 * @desc    Create new staff
 * @route   POST /api/staff/create
 * @access  Private (Admin only - role 99)
 */
exports.createStaff = async (req, res, next) => {
  try {
    const {
      staffName,
      password,
      role,
      mobileNumber,
      address,
      nic,
      profileImageUrl,
    } = req.body;

    const userId = req.user._id;
    const userName = req.user.userName;
    const userRole = req.user.role;

    logger.info('Create staff attempt', {
      staffName,
      userId: userId.toString(),
      userName,
      userRole,
      ip: req.ip,
    });

    // Check if user is admin
    if (userRole !== 99) {
      logger.warn('Unauthorized staff creation attempt', {
        userId: userId.toString(),
        userName,
        userRole,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Admin can create staff.',
      });
    }

    // Check if NIC already exists (if provided)
    if (nic) {
      const existingStaffByNic = await Staff.findOne({ nic });
      
      if (existingStaffByNic) {
        logger.warn('Staff creation failed: NIC already exists', {
          nic,
          userId: userId.toString(),
          ip: req.ip,
        });

        return res.status(400).json({
          success: false,
          message: 'NIC already exists',
        });
      }
    }

    // Create new staff
    const staffData = {
      staffName,
      password,
      role: role || 89, // Default to 89 (Staff)
      createdBy: userId,
    };

    // Add optional fields if provided
    if (mobileNumber) staffData.mobileNumber = mobileNumber;
    if (address) staffData.address = address;
    if (nic) staffData.nic = nic;
    if (profileImageUrl) staffData.profileImageUrl = profileImageUrl;

    const staff = await Staff.create(staffData);

    // Populate creator details
    await staff.populate('createdBy', 'userName role');

    logger.info('Staff created successfully', {
      staffId: staff._id.toString(),
      staffName: staff.staffName,
      createdBy: userId.toString(),
      createdByName: userName,
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Staff created successfully',
      data: {
        staffId: staff._id,
        staffName: staff.staffName,
        role: staff.role,
        mobileNumber: staff.mobileNumber,
        address: staff.address,
        nic: staff.nic,
        profileImageUrl: staff.profileImageUrl,
        isActive: staff.isActive,
        createdBy: {
          userId: staff.createdBy._id,
          userName: staff.createdBy.userName,
        },
        createdAt: staff.createdAt,
        updatedAt: staff.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Create staff error', {
      message: error.message,
      stack: error.stack,
      staffName: req.body.staffName,
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

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'NIC already exists',
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      message: 'Server error while creating staff',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Update staff
 * @route   POST /api/staff/update
 * @access  Private (Admin only - role 99)
 */
exports.updateStaff = async (req, res, next) => {
  try {
    const {
      staffId,
      staffName,
      mobileNumber,
      address,
      nic,
      profileImageUrl,
    } = req.body;

    const userId = req.user._id;
    const userName = req.user.userName;
    const userRole = req.user.role;

    logger.info('Update staff attempt', {
      staffId,
      userId: userId.toString(),
      userName,
      userRole,
      ip: req.ip,
    });

    // Check if user is admin
    if (userRole !== 99) {
      logger.warn('Unauthorized staff update attempt', {
        userId: userId.toString(),
        userName,
        userRole,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Admin can update staff.',
      });
    }

    // Find staff
    const staff = await Staff.findById(staffId);

    if (!staff) {
      logger.warn('Update failed: Staff not found', {
        staffId,
        userId: userId.toString(),
        ip: req.ip,
      });

      return res.status(404).json({
        success: false,
        message: 'Staff not found',
      });
    }

    // Check if NIC is being changed and if new NIC already exists
    if (nic && nic !== staff.nic) {
      const existingStaffByNic = await Staff.findOne({
        nic,
        _id: { $ne: staffId },
      });

      if (existingStaffByNic) {
        logger.warn('Update failed: NIC already exists', {
          nic,
          staffId,
          userId: userId.toString(),
          ip: req.ip,
        });

        return res.status(400).json({
          success: false,
          message: 'NIC already exists',
        });
      }
    }

    // Store old name for logging
    const oldStaffName = staff.staffName;

    // Update staff fields
    if (staffName) staff.staffName = staffName;
    if (mobileNumber !== undefined) staff.mobileNumber = mobileNumber;
    if (address !== undefined) staff.address = address;
    if (nic !== undefined) staff.nic = nic;
    if (profileImageUrl !== undefined) staff.profileImageUrl = profileImageUrl;
    staff.updatedBy = userId;

    await staff.save();

    // Populate references
    await staff.populate([
      { path: 'createdBy', select: 'userName role' },
      { path: 'updatedBy', select: 'userName role' },
    ]);

    logger.info('Staff updated successfully', {
      staffId: staff._id.toString(),
      oldName: oldStaffName,
      newName: staff.staffName,
      updatedBy: userId.toString(),
      updatedByName: userName,
    });

    res.status(200).json({
      success: true,
      message: 'Staff updated successfully',
      data: {
        staffId: staff._id,
        staffName: staff.staffName,
        role: staff.role,
        mobileNumber: staff.mobileNumber,
        address: staff.address,
        nic: staff.nic,
        profileImageUrl: staff.profileImageUrl,
        isActive: staff.isActive,
        createdBy: staff.createdBy
          ? {
              userId: staff.createdBy._id,
              userName: staff.createdBy.userName,
            }
          : null,
        updatedBy: staff.updatedBy
          ? {
              userId: staff.updatedBy._id,
              userName: staff.updatedBy.userName,
            }
          : null,
        createdAt: staff.createdAt,
        updatedAt: staff.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Update staff error', {
      message: error.message,
      stack: error.stack,
      staffId: req.body.staffId,
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

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid staff ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating staff',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Activate or Deactivate staff
 * @route   POST /api/staff/status
 * @access  Private (Admin only - role 99)
 */
exports.updateStaffStatus = async (req, res, next) => {
  try {
    const { staffId, isActive } = req.body;
    const userId = req.user._id;
    const userName = req.user.userName;
    const userRole = req.user.role;

    logger.info('Update staff status attempt', {
      staffId,
      isActive,
      userId: userId.toString(),
      userName,
      userRole,
      ip: req.ip,
    });

    // Check if user is admin
    if (userRole !== 99) {
      logger.warn('Unauthorized staff status update attempt', {
        userId: userId.toString(),
        userName,
        userRole,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Admin can update staff status.',
      });
    }

    // Find staff
    const staff = await Staff.findById(staffId);

    if (!staff) {
      logger.warn('Status update failed: Staff not found', {
        staffId,
        userId: userId.toString(),
        ip: req.ip,
      });

      return res.status(404).json({
        success: false,
        message: 'Staff not found',
      });
    }

    // Store old status for logging
    const oldStatus = staff.isActive;

    // Update status
    staff.isActive = isActive;
    staff.updatedBy = userId;
    await staff.save();

    // Populate user details
    await staff.populate('updatedBy', 'userName role');

    logger.info('Staff status updated successfully', {
      staffId: staff._id.toString(),
      staffName: staff.staffName,
      oldStatus,
      newStatus: staff.isActive,
      updatedBy: userId.toString(),
      updatedByName: userName,
    });

    res.status(200).json({
      success: true,
      message: `Staff ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        staffId: staff._id,
        staffName: staff.staffName,
        isActive: staff.isActive,
        updatedBy: staff.updatedBy
          ? {
              userId: staff.updatedBy._id,
              userName: staff.updatedBy.userName,
            }
          : null,
        updatedAt: staff.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Update staff status error', {
      message: error.message,
      stack: error.stack,
      staffId: req.body.staffId,
      userId: req.user._id.toString(),
    });

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid staff ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating staff status',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Delete staff
 * @route   POST /api/staff/delete
 * @access  Private (Admin only - role 99)
 */
exports.deleteStaff = async (req, res, next) => {
  try {
    const { staffId } = req.body;
    const userId = req.user._id;
    const userName = req.user.userName;
    const userRole = req.user.role;

    logger.info('Delete staff attempt', {
      staffId,
      userId: userId.toString(),
      userName,
      userRole,
      ip: req.ip,
    });

    // Check if user is admin
    if (userRole !== 99) {
      logger.warn('Unauthorized staff deletion attempt', {
        userId: userId.toString(),
        userName,
        userRole,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Admin can delete staff.',
      });
    }

    // Find and delete staff
    const staff = await Staff.findById(staffId);

    if (!staff) {
      logger.warn('Delete failed: Staff not found', {
        staffId,
        userId: userId.toString(),
        ip: req.ip,
      });

      return res.status(404).json({
        success: false,
        message: 'Staff not found',
      });
    }

    // Store staff details for logging before deletion
    const deletedStaffDetails = {
      staffId: staff._id.toString(),
      staffName: staff.staffName,
      mobileNumber: staff.mobileNumber,
    };

    // Delete the staff
    await Staff.findByIdAndDelete(staffId);

    logger.info('Staff deleted successfully', {
      ...deletedStaffDetails,
      deletedBy: userId.toString(),
      deletedByName: userName,
    });

    res.status(200).json({
      success: true,
      message: 'Staff deleted successfully',
      data: {
        staffId: deletedStaffDetails.staffId,
        staffName: deletedStaffDetails.staffName,
      },
    });
  } catch (error) {
    logger.error('Delete staff error', {
      message: error.message,
      stack: error.stack,
      staffId: req.body.staffId,
      userId: req.user._id.toString(),
    });

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid staff ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting staff',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Get all staff
 * @route   GET /api/staff/all
 * @access  Private (Admin only - role 99)
 */
exports.getAllStaff = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userName = req.user.userName;

    logger.info('Fetching all staff', {
      requestedBy: userId.toString(),
      userName,
    });

    const staffList = await Staff.find()
      .populate('createdBy', 'userName role')
      .populate('updatedBy', 'userName role')
      .sort({ createdAt: -1 });

    logger.info('Staff retrieved successfully', {
      count: staffList.length,
      requestedBy: userId.toString(),
    });

    res.status(200).json({
      success: true,
      count: staffList.length,
      data: staffList.map((staff) => ({
        staffId: staff._id,
        staffName: staff.staffName,
        role: staff.role,
        mobileNumber: staff.mobileNumber,
        address: staff.address,
        nic: staff.nic,
        profileImageUrl: staff.profileImageUrl,
        isActive: staff.isActive,
        createdBy: staff.createdBy
          ? {
              userId: staff.createdBy._id,
              userName: staff.createdBy.userName,
            }
          : null,
        updatedBy: staff.updatedBy
          ? {
              userId: staff.updatedBy._id,
              userName: staff.updatedBy.userName,
            }
          : null,
        createdAt: staff.createdAt,
        updatedAt: staff.updatedAt,
      })),
    });
  } catch (error) {
    logger.error('Get all staff error', {
      message: error.message,
      stack: error.stack,
      userId: req.user._id.toString(),
    });

    res.status(500).json({
      success: false,
      message: 'Server error while fetching staff',
    });
  }
};

/**
 * @desc    Get active staff only
 * @route   GET /api/staff/active
 * @access  Private (Admin only - role 99)
 */
exports.getActiveStaff = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userName = req.user.userName;

    logger.info('Fetching active staff', {
      requestedBy: userId.toString(),
      userName,
    });

    const staffList = await Staff.find({ isActive: true })
      .select('staffName mobileNumber profileImageUrl createdAt')
      .sort({ staffName: 1 });

    logger.info('Active staff retrieved successfully', {
      count: staffList.length,
      requestedBy: userId.toString(),
    });

    res.status(200).json({
      success: true,
      count: staffList.length,
      data: staffList.map((staff) => ({
        staffId: staff._id,
        staffName: staff.staffName,
        mobileNumber: staff.mobileNumber,
        profileImageUrl: staff.profileImageUrl,
      })),
    });
  } catch (error) {
    logger.error('Get active staff error', {
      message: error.message,
      stack: error.stack,
      userId: req.user._id.toString(),
    });

    res.status(500).json({
      success: false,
      message: 'Server error while fetching active staff',
    });
  }
};

