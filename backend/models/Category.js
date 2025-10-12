// Category Model for POS System
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters long'],
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
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
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for faster queries
categorySchema.index({ categoryName: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ createdBy: 1 });

// Transform output
categorySchema.methods.toJSON = function () {
  const category = this.toObject();
  delete category.__v;
  return category;
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

