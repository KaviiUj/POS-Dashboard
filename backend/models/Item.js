// Item Model for Restaurant POS System
const mongoose = require('mongoose');

// Modifier schema for item options/add-ons
const modifierSchema = new mongoose.Schema(
  {
    modifierName: {
      type: String,
      required: true,
      trim: true,
    },
    modifierPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const itemSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
    },
    categoryName: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      minlength: [2, 'Item name must be at least 2 characters long'],
      maxlength: [200, 'Item name cannot exceed 200 characters'],
    },
    itemDescription: {
      type: String,
      required: [true, 'Item description is required'],
      trim: true,
      maxlength: [1000, 'Item description cannot exceed 1000 characters'],
    },
    itemImage: {
      type: String,
      required: [true, 'Item image is required'],
      trim: true,
    },
    isVeg: {
      type: Boolean,
      required: [true, 'Veg/Non-veg status is required'],
    },
    cuisine: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, 'Cuisine cannot exceed 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    modifiers: {
      type: [modifierSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
itemSchema.index({ categoryId: 1 });
itemSchema.index({ itemName: 1 });
itemSchema.index({ isVeg: 1 });
itemSchema.index({ cuisine: 1 });
itemSchema.index({ isActive: 1 });
itemSchema.index({ createdBy: 1 });

// Compound index for category and active items
itemSchema.index({ categoryId: 1, isActive: 1 });

// Transform output
itemSchema.methods.toJSON = function () {
  const item = this.toObject();
  delete item.__v;
  return item;
};

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;

