// Table Controller
const Table = require('../models/Table');
const logger = require('../utils/logger');

/**
 * @desc    Create new table
 * @route   POST /api/table/create
 * @access  Private (Admin only - role 99)
 */
exports.createTable = async (req, res, next) => {
  try {
    const { tableName, pax, isAvailable, orderId } = req.body;
    const userId = req.user._id;
    const userName = req.user.userName;
    const userRole = req.user.role;

    logger.info('Create table attempt', {
      tableName,
      pax,
      isAvailable,
      orderId,
      userId: userId.toString(),
      userName,
      userRole,
      ip: req.ip,
    });

    // Check if user is admin (additional safety check)
    if (userRole !== 99) {
      logger.warn('Unauthorized table creation attempt', {
        userId: userId.toString(),
        userName,
        userRole,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Admin can create tables.',
      });
    }

    // Check if table already exists
    const existingTable = await Table.findOne({ tableName });

    if (existingTable) {
      logger.warn('Table creation failed: Table already exists', {
        tableName,
        userId: userId.toString(),
        userName,
        ip: req.ip,
      });

      return res.status(400).json({
        success: false,
        message: 'Table with this name already exists',
      });
    }

    // Create new table
    const tableData = {
      tableName,
    };

    // Add optional fields if provided
    if (pax !== undefined) {
      tableData.pax = pax;
    }

    if (isAvailable !== undefined) {
      tableData.isAvailable = isAvailable;
    }

    if (orderId !== undefined && orderId !== null && orderId !== '') {
      tableData.orderId = orderId;
    }

    const table = await Table.create(tableData);

    logger.info('Table created successfully', {
      tableId: table._id.toString(),
      tableName: table.tableName,
      createdBy: userId.toString(),
      createdByName: userName,
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Table created successfully',
      data: {
        tableId: table._id,
        tableName: table.tableName,
        pax: table.pax,
        isAvailable: table.isAvailable,
        orderId: table.orderId,
        createdAt: table.createdAt,
        updatedAt: table.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Create table error', {
      message: error.message,
      stack: error.stack,
      tableName: req.body.tableName,
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
        message: 'Table with this name already exists',
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      message: 'Server error while creating table',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Delete table
 * @route   POST /api/table/delete
 * @access  Private (Admin only - role 99)
 */
exports.deleteTable = async (req, res, next) => {
  try {
    const { tableId } = req.body;
    const userId = req.user._id;
    const userName = req.user.userName;
    const userRole = req.user.role;

    logger.info('Delete table attempt', {
      tableId,
      userId: userId.toString(),
      userName,
      userRole,
      ip: req.ip,
    });

    // Check if user is admin
    if (userRole !== 99) {
      logger.warn('Unauthorized table deletion attempt', {
        userId: userId.toString(),
        userName,
        userRole,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Admin can delete tables.',
      });
    }

    // Find and delete table
    const table = await Table.findById(tableId);

    if (!table) {
      logger.warn('Delete failed: Table not found', {
        tableId,
        userId: userId.toString(),
        ip: req.ip,
      });

      return res.status(404).json({
        success: false,
        message: 'Table not found',
      });
    }

    // Store table info for logging before deletion
    const deletedTableName = table.tableName;
    const deletedTableId = table._id.toString();

    // Delete the table
    await Table.findByIdAndDelete(tableId);

    logger.info('Table deleted successfully', {
      tableId: deletedTableId,
      tableName: deletedTableName,
      deletedBy: userId.toString(),
      deletedByName: userName,
    });

    res.status(200).json({
      success: true,
      message: 'Table deleted successfully',
      data: {
        tableId: deletedTableId,
        tableName: deletedTableName,
      },
    });
  } catch (error) {
    logger.error('Delete table error', {
      message: error.message,
      stack: error.stack,
      tableId: req.body.tableId,
      userId: req.user._id.toString(),
    });

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid table ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting table',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Get all tables
 * @route   GET /api/table/all
 * @access  Private (Admin only)
 */
exports.getAllTables = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userName = req.user.userName;

    logger.info('Fetching all tables', {
      requestedBy: userId.toString(),
      userName,
    });

    const tables = await Table.find()
      .sort({ createdAt: -1 });

    logger.info('Tables retrieved successfully', {
      count: tables.length,
      requestedBy: userId.toString(),
    });

    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables.map((table) => ({
        tableId: table._id,
        tableName: table.tableName,
        pax: table.pax,
        isAvailable: table.isAvailable,
        orderId: table.orderId,
        createdAt: table.createdAt,
        updatedAt: table.updatedAt,
      })),
    });
  } catch (error) {
    logger.error('Get all tables error', {
      message: error.message,
      stack: error.stack,
      userId: req.user._id.toString(),
    });

    res.status(500).json({
      success: false,
      message: 'Server error while fetching tables',
    });
  }
};

/**
 * @desc    Get available tables only
 * @route   GET /api/table/available
 * @access  Private
 */
exports.getAvailableTables = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userName = req.user.userName;

    logger.info('Fetching available tables', {
      requestedBy: userId.toString(),
      userName,
    });

    const tables = await Table.find({ isAvailable: true })
      .sort({ tableName: 1 });

    logger.info('Available tables retrieved successfully', {
      count: tables.length,
      requestedBy: userId.toString(),
    });

    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables.map((table) => ({
        tableId: table._id,
        tableName: table.tableName,
        pax: table.pax,
        createdAt: table.createdAt,
      })),
    });
  } catch (error) {
    logger.error('Get available tables error', {
      message: error.message,
      stack: error.stack,
      userId: req.user._id.toString(),
    });

    res.status(500).json({
      success: false,
      message: 'Server error while fetching available tables',
    });
  }
};

