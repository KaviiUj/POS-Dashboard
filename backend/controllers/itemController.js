// Item Controller for Restaurant POS
const Item = require('../models/Item');
const Category = require('../models/Category');
const logger = require('../utils/logger');

/**
 * @desc    Add new item
 * @route   POST /api/item/add
 * @access  Private (Admin only - role 99)
 */
exports.addItem = async (req, res, next) => {
  try {
    const {
      categoryId,
      categoryName,
      itemName,
      itemDescription,
      itemImage,
      isVeg,
      cuisine,
      price,
      discount,
      modifiers,
    } = req.body;

    const userId = req.user._id;
    const userName = req.user.userName;
    const userRole = req.user.role;

    logger.info('Add item attempt', {
      itemName,
      categoryName,
      userId: userId.toString(),
      userName,
      userRole,
      ip: req.ip,
    });

    // Check if user is admin
    if (userRole !== 99) {
      logger.warn('Unauthorized item creation attempt', {
        userId: userId.toString(),
        userName,
        userRole,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Admin can create items.',
      });
    }

    // Verify category exists
    const category = await Category.findById(categoryId);

    if (!category) {
      logger.warn('Item creation failed: Category not found', {
        categoryId,
        userId: userId.toString(),
        ip: req.ip,
      });

      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Verify category is active
    if (!category.isActive) {
      logger.warn('Item creation failed: Category is inactive', {
        categoryId,
        categoryName: category.categoryName,
        userId: userId.toString(),
        ip: req.ip,
      });

      return res.status(400).json({
        success: false,
        message: 'Cannot add items to inactive category',
      });
    }

    // Create new item
    const itemData = {
      categoryId,
      categoryName,
      itemName,
      itemDescription,
      itemImage,
      isVeg,
      price,
      modifiers: modifiers || [],
      createdBy: userId,
    };

    // Add cuisine only if provided (optional for Drinks/Beverages)
    if (cuisine) {
      itemData.cuisine = cuisine;
    }

    // Add discount if provided
    if (discount !== undefined) {
      itemData.discount = discount;
    }

    const item = await Item.create(itemData);

    // Populate category and creator details
    await item.populate([
      { path: 'categoryId', select: 'categoryName isActive' },
      { path: 'createdBy', select: 'userName role' },
    ]);

    logger.info('Item created successfully', {
      itemId: item._id.toString(),
      itemName: item.itemName,
      categoryName: item.categoryName,
      createdBy: userId.toString(),
      createdByName: userName,
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: {
        itemId: item._id,
        categoryId: item.categoryId._id,
        categoryName: item.categoryName,
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        itemImage: item.itemImage,
        isVeg: item.isVeg,
        cuisine: item.cuisine,
        price: item.price,
        discount: item.discount,
        modifiers: item.modifiers,
        isActive: item.isActive,
        createdBy: {
          userId: item.createdBy._id,
          userName: item.createdBy.userName,
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Add item error', {
      message: error.message,
      stack: error.stack,
      itemName: req.body.itemName,
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
        message: 'Invalid category ID',
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      message: 'Server error while creating item',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Get all items
 * @route   GET /api/item/all
 * @access  Private (Admin only)
 */
exports.getAllItems = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userName = req.user.userName;

    logger.info('Fetching all items', {
      requestedBy: userId.toString(),
      userName,
    });

    const items = await Item.find()
      .populate('categoryId', 'categoryName isActive')
      .populate('createdBy', 'userName role')
      .populate('updatedBy', 'userName role')
      .sort({ createdAt: -1 });

    logger.info('Items retrieved successfully', {
      count: items.length,
      requestedBy: userId.toString(),
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items.map((item) => ({
        itemId: item._id,
        categoryId: item.categoryId?._id,
        categoryName: item.categoryName,
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        itemImage: item.itemImage,
        isVeg: item.isVeg,
        cuisine: item.cuisine,
        price: item.price,
        discount: item.discount,
        modifiers: item.modifiers,
        isActive: item.isActive,
        createdBy: item.createdBy
          ? {
              userId: item.createdBy._id,
              userName: item.createdBy.userName,
            }
          : null,
        updatedBy: item.updatedBy
          ? {
              userId: item.updatedBy._id,
              userName: item.updatedBy.userName,
            }
          : null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    });
  } catch (error) {
    logger.error('Get all items error', {
      message: error.message,
      stack: error.stack,
      userId: req.user._id.toString(),
    });

    res.status(500).json({
      success: false,
      message: 'Server error while fetching items',
    });
  }
};

/**
 * @desc    Get items by category
 * @route   GET /api/item/category?categoryId=xxx
 * @access  Private (Admin only)
 */
exports.getItemsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.query;
    const userId = req.user._id;
    const userName = req.user.userName;

    // Validate categoryId
    if (!categoryId) {
      logger.warn('Get items by category: categoryId missing', {
        userId: userId.toString(),
        userName,
        ip: req.ip,
      });

      return res.status(400).json({
        success: false,
        message: 'Category ID is required',
      });
    }

    logger.info('Fetching items by category', {
      categoryId,
      requestedBy: userId.toString(),
      userName,
    });

    const items = await Item.find({ categoryId })
      .populate('categoryId', 'categoryName isActive')
      .populate('createdBy', 'userName role')
      .sort({ itemName: 1 });

    logger.info('Items by category retrieved successfully', {
      categoryId,
      count: items.length,
      requestedBy: userId.toString(),
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items.map((item) => ({
        itemId: item._id,
        categoryId: item.categoryId?._id,
        categoryName: item.categoryName,
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        itemImage: item.itemImage,
        isVeg: item.isVeg,
        cuisine: item.cuisine,
        price: item.price,
        discount: item.discount,
        modifiers: item.modifiers,
        isActive: item.isActive,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    logger.error('Get items by category error', {
      message: error.message,
      stack: error.stack,
      categoryId: req.query.categoryId,
      userId: req.user._id.toString(),
    });

    res.status(500).json({
      success: false,
      message: 'Server error while fetching items by category',
    });
  }
};

/**
 * @desc    Update item
 * @route   POST /api/item/update
 * @access  Private (Admin only - role 99)
 */
exports.updateItem = async (req, res, next) => {
  try {
    const {
      itemId,
      itemName,
      itemDescription,
      itemImage,
      isVeg,
      cuisine,
      price,
      discount,
      modifiers,
    } = req.body;

    const userId = req.user._id;
    const userName = req.user.userName;
    const userRole = req.user.role;

    logger.info('Update item attempt', {
      itemId,
      itemName,
      userId: userId.toString(),
      userName,
      userRole,
      ip: req.ip,
    });

    // Check if user is admin
    if (userRole !== 99) {
      logger.warn('Unauthorized item update attempt', {
        userId: userId.toString(),
        userName,
        userRole,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Admin can update items.',
      });
    }

    // Find item
    const item = await Item.findById(itemId);

    if (!item) {
      logger.warn('Update failed: Item not found', {
        itemId,
        userId: userId.toString(),
        ip: req.ip,
      });

      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Store old values for logging
    const oldItemName = item.itemName;

    // Update item fields (category cannot be changed)
    if (itemName) item.itemName = itemName;
    if (itemDescription) item.itemDescription = itemDescription;
    if (itemImage) item.itemImage = itemImage;
    if (typeof isVeg !== 'undefined') item.isVeg = isVeg;
    if (cuisine !== undefined) item.cuisine = cuisine; // Allow empty string to clear cuisine
    if (price !== undefined) item.price = price;
    if (discount !== undefined) item.discount = discount;
    if (modifiers !== undefined) item.modifiers = modifiers;
    item.updatedBy = userId;

    await item.save();

    // Populate references
    await item.populate([
      { path: 'categoryId', select: 'categoryName isActive' },
      { path: 'createdBy', select: 'userName role' },
      { path: 'updatedBy', select: 'userName role' },
    ]);

    logger.info('Item updated successfully', {
      itemId: item._id.toString(),
      oldName: oldItemName,
      newName: item.itemName,
      categoryName: item.categoryName,
      updatedBy: userId.toString(),
      updatedByName: userName,
    });

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: {
        itemId: item._id,
        categoryId: item.categoryId._id,
        categoryName: item.categoryName,
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        itemImage: item.itemImage,
        isVeg: item.isVeg,
        cuisine: item.cuisine,
        price: item.price,
        discount: item.discount,
        modifiers: item.modifiers,
        isActive: item.isActive,
        createdBy: item.createdBy
          ? {
              userId: item.createdBy._id,
              userName: item.createdBy.userName,
            }
          : null,
        updatedBy: item.updatedBy
          ? {
              userId: item.updatedBy._id,
              userName: item.updatedBy.userName,
            }
          : null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Update item error', {
      message: error.message,
      stack: error.stack,
      itemId: req.body.itemId,
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
        message: 'Invalid item ID or category ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating item',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Activate or Deactivate item
 * @route   POST /api/item/status
 * @access  Private (Admin only - role 99)
 */
exports.updateItemStatus = async (req, res, next) => {
  try {
    const { itemId, isActive } = req.body;
    const userId = req.user._id;
    const userName = req.user.userName;
    const userRole = req.user.role;

    logger.info('Update item status attempt', {
      itemId,
      isActive,
      userId: userId.toString(),
      userName,
      userRole,
      ip: req.ip,
    });

    // Check if user is admin
    if (userRole !== 99) {
      logger.warn('Unauthorized item status update attempt', {
        userId: userId.toString(),
        userName,
        userRole,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Admin can update item status.',
      });
    }

    // Find item
    const item = await Item.findById(itemId);

    if (!item) {
      logger.warn('Status update failed: Item not found', {
        itemId,
        userId: userId.toString(),
        ip: req.ip,
      });

      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Store old status for logging
    const oldStatus = item.isActive;

    // Update status
    item.isActive = isActive;
    item.updatedBy = userId;
    await item.save();

    // Populate user details
    await item.populate('updatedBy', 'userName role');

    logger.info('Item status updated successfully', {
      itemId: item._id.toString(),
      itemName: item.itemName,
      categoryName: item.categoryName,
      oldStatus,
      newStatus: item.isActive,
      updatedBy: userId.toString(),
      updatedByName: userName,
    });

    res.status(200).json({
      success: true,
      message: `Item ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        itemId: item._id,
        itemName: item.itemName,
        categoryName: item.categoryName,
        isActive: item.isActive,
        updatedBy: item.updatedBy
          ? {
              userId: item.updatedBy._id,
              userName: item.updatedBy.userName,
            }
          : null,
        updatedAt: item.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Update item status error', {
      message: error.message,
      stack: error.stack,
      itemId: req.body.itemId,
      userId: req.user._id.toString(),
    });

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating item status',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Delete item
 * @route   POST /api/item/delete
 * @access  Private (Admin only - role 99)
 */
exports.deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    const userId = req.user._id;
    const userName = req.user.userName;
    const userRole = req.user.role;

    logger.info('Delete item attempt', {
      itemId,
      userId: userId.toString(),
      userName,
      userRole,
      ip: req.ip,
    });

    // Check if user is admin
    if (userRole !== 99) {
      logger.warn('Unauthorized item deletion attempt', {
        userId: userId.toString(),
        userName,
        userRole,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Only Admin can delete items.',
      });
    }

    // Find and delete item
    const item = await Item.findById(itemId);

    if (!item) {
      logger.warn('Delete failed: Item not found', {
        itemId,
        userId: userId.toString(),
        ip: req.ip,
      });

      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Store item details for logging before deletion
    const deletedItemDetails = {
      itemId: item._id.toString(),
      itemName: item.itemName,
      categoryName: item.categoryName,
      categoryId: item.categoryId.toString(),
    };

    // Delete the item
    await Item.findByIdAndDelete(itemId);

    logger.info('Item deleted successfully', {
      ...deletedItemDetails,
      deletedBy: userId.toString(),
      deletedByName: userName,
    });

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
      data: {
        itemId: deletedItemDetails.itemId,
        itemName: deletedItemDetails.itemName,
        categoryName: deletedItemDetails.categoryName,
      },
    });
  } catch (error) {
    logger.error('Delete item error', {
      message: error.message,
      stack: error.stack,
      itemId: req.body.itemId,
      userId: req.user._id.toString(),
    });

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting item',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Get active items only
 * @route   GET /api/item/active
 * @access  Private (Admin only)
 */
exports.getActiveItems = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userName = req.user.userName;

    logger.info('Fetching active items', {
      requestedBy: userId.toString(),
      userName,
    });

    const items = await Item.find({ isActive: true })
      .populate('categoryId', 'categoryName isActive')
      .sort({ categoryName: 1, itemName: 1 });

    logger.info('Active items retrieved successfully', {
      count: items.length,
      requestedBy: userId.toString(),
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items.map((item) => ({
        itemId: item._id,
        categoryName: item.categoryName,
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        itemImage: item.itemImage,
        isVeg: item.isVeg,
        cuisine: item.cuisine,
        price: item.price,
        discount: item.discount,
        modifiers: item.modifiers,
      })),
    });
  } catch (error) {
    logger.error('Get active items error', {
      message: error.message,
      stack: error.stack,
      userId: req.user._id.toString(),
    });

    res.status(500).json({
      success: false,
      message: 'Server error while fetching active items',
    });
  }
};

