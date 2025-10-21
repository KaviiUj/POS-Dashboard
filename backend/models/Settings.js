// Settings Model for POS System
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Logo URL cannot exceed 500 characters'],
    },
    showCuisineFilter: {
      type: Boolean,
      default: false,
    },
    showModifiers: {
      type: Boolean,
      default: false,
    },
    showModifiersPrice: {
      type: Boolean,
      default: false,
    },
    outletName: {
      type: String,
      required: [true, 'Outlet name is required'],
      trim: true,
      minlength: [2, 'Outlet name must be at least 2 characters long'],
      maxlength: [100, 'Outlet name cannot exceed 100 characters'],
    },
    outletCurrency: {
      type: String,
      default: 'LKR',
      trim: true,
      maxlength: [10, 'Currency code cannot exceed 10 characters'],
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

// Transform output
settingsSchema.methods.toJSON = function () {
  const settings = this.toObject();
  delete settings.__v;
  return settings;
};

// Static method to get or create settings (singleton pattern)
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  
  // If no settings exist, create default settings
  if (!settings) {
    settings = await this.create({
      logo: '',
      showCuisineFilter: false,
      showModifiers: false,
      showModifiersPrice: false,
      outletName: 'My Restaurant',
      outletCurrency: 'LKR',
    });
  }
  
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;

