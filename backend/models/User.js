// User Model
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    restaurantCode: {
      type: String,
      required: [true, 'Restaurant code is required'],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [50, 'Username cannot exceed 50 characters'],
    },
    passWord: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: Number,
      required: [true, 'Role is required'],
      enum: {
        values: [99, 89],
        message: 'Role must be either 99 (Admin) or 89 (Staff)',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for faster queries
userSchema.index({ restaurantCode: 1 });
userSchema.index({ userName: 1 });
userSchema.index({ role: 1 });
userSchema.index({ restaurantCode: 1, userName: 1 }, { unique: true }); // Unique username per restaurant

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('passWord')) {
    return next();
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash password
    this.passWord = await bcrypt.hash(this.passWord, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.passWord);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to get user role name
userSchema.methods.getRoleName = function () {
  const roleMap = {
    99: 'Admin',
    89: 'Staff',
  };
  return roleMap[this.role] || 'Unknown';
};

// Static method to get role value from name
userSchema.statics.getRoleValue = function (roleName) {
  const roleMap = {
    Admin: 99,
    Staff: 89,
  };
  return roleMap[roleName];
};

// Transform output (remove sensitive data)
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passWord;
  delete user.__v;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

