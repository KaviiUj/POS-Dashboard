// Staff Model for POS System
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema(
  {
    staffName: {
      type: String,
      required: [true, 'Staff name is required'],
      trim: true,
      minlength: [3, 'Staff name must be at least 3 characters long'],
      maxlength: [100, 'Staff name cannot exceed 100 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: Number,
      required: [true, 'Role is required'],
      default: 89,
      enum: {
        values: [89],
        message: 'Role must be 89 (Staff)',
      },
    },
    mobileNumber: {
      type: String,
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Please provide a valid mobile number'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      maxlength: [255, 'Email cannot exceed 255 characters'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters'],
    },
    nic: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allow multiple null values
      maxlength: [50, 'NIC cannot exceed 50 characters'],
    },
    profileImageUrl: {
      type: String,
      trim: true,
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

// Indexes for faster queries
staffSchema.index({ staffName: 1 });
staffSchema.index({ nic: 1 });
staffSchema.index({ mobileNumber: 1 });
staffSchema.index({ email: 1 });
staffSchema.index({ isActive: 1 });
staffSchema.index({ createdBy: 1 });

// Hash password before saving
staffSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
staffSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Transform output (remove sensitive data)
staffSchema.methods.toJSON = function () {
  const staff = this.toObject();
  delete staff.password;
  delete staff.__v;
  return staff;
};

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;

