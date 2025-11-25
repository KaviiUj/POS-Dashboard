// Table Model for POS System
const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    restaurantCode: {
      type: String,
      required: [true, 'Restaurant code is required'],
      trim: true,
    },
    tableName: {
      type: String,
      required: [true, 'Table name is required'],
      trim: true,
      minlength: [1, 'Table name must be at least 1 character long'],
      maxlength: [50, 'Table name cannot exceed 50 characters'],
    },
    pax: {
      type: Number,
      default: 4,
      min: [1, 'Pax must be at least 1'],
      max: [50, 'Pax cannot exceed 50'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for faster queries
tableSchema.index({ restaurantCode: 1 });
tableSchema.index({ tableName: 1 });
tableSchema.index({ isAvailable: 1 });
tableSchema.index({ orderId: 1 });
tableSchema.index({ restaurantCode: 1, tableName: 1 }, { unique: true }); // Unique table name per restaurant

// Transform output
tableSchema.methods.toJSON = function () {
  const table = this.toObject();
  delete table.__v;
  return table;
};

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;

