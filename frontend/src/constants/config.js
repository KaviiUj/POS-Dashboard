/**
 * Application Configuration Constants
 */

// Session Configuration
export const SESSION_CONFIG = {
  // Inactivity timeout in minutes
  INACTIVITY_TIMEOUT_MINUTES: 15, // Change back to 15 for production
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
};

// Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};

// Pagination Configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Toast Configuration
export const TOAST_CONFIG = {
  DEFAULT_DURATION: 3000,
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 5000,
  WARNING_DURATION: 4000,
};

export default {
  SESSION_CONFIG,
  API_CONFIG,
  UPLOAD_CONFIG,
  PAGINATION_CONFIG,
  TOAST_CONFIG,
};

