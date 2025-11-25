// Token Blacklist Model - for invalidated tokens
const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema(
  {
    restaurantCode: {
      type: String,
      required: [true, 'Restaurant code is required'],
      trim: true,
    },
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      default: 'logout',
      enum: ['logout', 'security', 'expired'],
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries and auto-deletion
tokenBlacklistSchema.index({ restaurantCode: 1 });
tokenBlacklistSchema.index({ token: 1 });
tokenBlacklistSchema.index({ userId: 1 });
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete when expired
tokenBlacklistSchema.index({ restaurantCode: 1, token: 1 }, { unique: true }); // Unique token per restaurant

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);

module.exports = TokenBlacklist;

