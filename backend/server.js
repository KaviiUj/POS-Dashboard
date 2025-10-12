// Server entry point
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const morganLogger = require('./middleware/morganLogger');
const requestLogger = require('./middleware/requestLogger');
const { errorLogger, errorHandler } = require('./middleware/errorLogger');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Logging Middleware (order matters!)
// 1. Morgan for HTTP request logging
app.use(morganLogger);

// 2. Detailed request/response logger
app.use(requestLogger);

// CORS Middleware
app.use(cors());

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRoutes = require('./routes/authRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  logger.info('Health check endpoint accessed');
  res.status(200).json({ 
    success: true,
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test error logging route (for development)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/test-error', (req, res, next) => {
    const error = new Error('This is a test error');
    error.statusCode = 400;
    next(error);
  });
}

// 404 Handler - Must be after all routes
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Error Logging Middleware
app.use(errorLogger);

// Global Error Handler (must be last)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server started successfully on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  logger.info(`Access logs available at: ./logs/access.log`);
  logger.info(`Error logs available at: ./logs/error.log`);
  logger.info(`Combined logs available at: ./logs/combined.log`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection', {
    message: err.message,
    stack: err.stack,
  });
  
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', {
    message: err.message,
    stack: err.stack,
  });
  
  // Exit process
  process.exit(1);
});

module.exports = app;


