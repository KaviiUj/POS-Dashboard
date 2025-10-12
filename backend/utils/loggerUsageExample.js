/**
 * Example usage of the logger throughout the application
 * This file demonstrates how to use the logger in different scenarios
 * 
 * Import this in your controllers, routes, or services
 */

const logger = require('./logger');

// ========== Example Usage ==========

// 1. INFO Level - General information
function exampleInfoLog() {
  logger.info('User logged in successfully', {
    userId: '12345',
    username: 'john_doe',
    timestamp: new Date().toISOString()
  });
}

// 2. ERROR Level - Error tracking
function exampleErrorLog() {
  try {
    // Some operation that might fail
    throw new Error('Database connection failed');
  } catch (error) {
    logger.error('Database Error', {
      message: error.message,
      stack: error.stack,
      operation: 'fetchUser',
      userId: '12345'
    });
  }
}

// 3. WARN Level - Warning messages
function exampleWarnLog() {
  logger.warn('API rate limit approaching', {
    currentRequests: 950,
    limit: 1000,
    userId: '12345',
    timeWindow: '1 hour'
  });
}

// 4. DEBUG Level - Debugging information
function exampleDebugLog() {
  logger.debug('Processing payment', {
    paymentId: 'pay_12345',
    amount: 99.99,
    currency: 'USD',
    step: 'validation'
  });
}

// 5. In a Controller
function userController() {
  const createUser = async (req, res) => {
    try {
      logger.info('Creating new user', {
        email: req.body.email,
        role: req.body.role
      });

      // Your logic here
      const user = { id: '123', email: req.body.email };

      logger.info('User created successfully', {
        userId: user.id,
        email: user.email
      });

      res.status(201).json({ success: true, user });
    } catch (error) {
      logger.error('Failed to create user', {
        error: error.message,
        email: req.body.email,
        stack: error.stack
      });

      res.status(500).json({ 
        success: false, 
        message: 'Failed to create user' 
      });
    }
  };

  return { createUser };
}

// 6. In a Service/Model
function databaseService() {
  const findUser = async (userId) => {
    logger.debug('Finding user in database', { userId });

    try {
      // Database query
      const user = null; // Replace with actual DB query

      if (!user) {
        logger.warn('User not found', { userId });
        return null;
      }

      logger.info('User found successfully', { 
        userId, 
        username: user.username 
      });

      return user;
    } catch (error) {
      logger.error('Database query failed', {
        operation: 'findUser',
        userId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  };

  return { findUser };
}

// 7. Logging with Multiple Fields
function exampleComplexLog() {
  logger.info('Payment processed', {
    transaction: {
      id: 'txn_12345',
      amount: 149.99,
      currency: 'USD',
      status: 'completed'
    },
    user: {
      id: 'user_789',
      email: 'user@example.com'
    },
    metadata: {
      paymentMethod: 'credit_card',
      last4: '4242',
      timestamp: new Date().toISOString()
    }
  });
}

// 8. Logging API Calls
async function exampleApiCallLog() {
  const apiUrl = 'https://api.example.com/data';
  
  logger.info('Making external API call', {
    url: apiUrl,
    method: 'GET'
  });

  try {
    // const response = await fetch(apiUrl);
    
    logger.info('API call successful', {
      url: apiUrl,
      status: 200,
      responseTime: '150ms'
    });
  } catch (error) {
    logger.error('API call failed', {
      url: apiUrl,
      error: error.message,
      stack: error.stack
    });
  }
}

// 9. Logging Business Logic
function exampleBusinessLogicLog() {
  const orderTotal = 150.00;
  const discountThreshold = 100.00;

  if (orderTotal > discountThreshold) {
    logger.info('Discount applied', {
      orderTotal,
      discountAmount: 15.00,
      discountPercent: 10,
      finalTotal: 135.00
    });
  }
}

// 10. Scheduled Task Logging
function exampleScheduledTaskLog() {
  logger.info('Starting scheduled task: Daily backup', {
    taskName: 'daily_backup',
    startTime: new Date().toISOString()
  });

  try {
    // Perform backup
    logger.info('Scheduled task completed successfully', {
      taskName: 'daily_backup',
      duration: '5 minutes',
      recordsBackedUp: 10000
    });
  } catch (error) {
    logger.error('Scheduled task failed', {
      taskName: 'daily_backup',
      error: error.message,
      stack: error.stack
    });
  }
}

module.exports = {
  exampleInfoLog,
  exampleErrorLog,
  exampleWarnLog,
  exampleDebugLog,
  userController,
  databaseService,
  exampleComplexLog,
  exampleApiCallLog,
  exampleBusinessLogicLog,
  exampleScheduledTaskLog
};

