# 📋 Comprehensive Logging System Guide

## Overview

Your POS Dashboard backend now includes a **comprehensive logging system** that tracks every aspect of your application including URLs, requests, responses, errors, and much more.

## 🎯 What Gets Logged

### 1. **HTTP Requests** (via Morgan + Custom Middleware)
- HTTP Method (GET, POST, PUT, DELETE, etc.)
- Full URL and route
- IP Address of the client
- User Agent (browser/client info)
- Request Headers
- Query Parameters
- Route Parameters
- Request Body (passwords automatically hidden)
- Timestamp

### 2. **HTTP Responses** (via Custom Middleware)
- Status Code (200, 404, 500, etc.)
- Status Message
- Response Time (in milliseconds)
- Content Type
- Content Length
- Response Body (for errors or small responses)
- Timestamp

### 3. **Errors** (via Error Logging Middleware)
- Error Message
- Stack Trace
- Request Context (URL, method, params, body)
- User Information (IP, User Agent)
- Status Code
- Timestamp

### 4. **Application Events**
- Server startup/shutdown
- Database connections
- Unhandled promise rejections
- Uncaught exceptions
- Business logic events
- Custom application logs

## 📁 Log Files Location

All logs are stored in: `backend/logs/`

### Log Files:

1. **`access.log`**
   - HTTP requests and responses
   - Morgan HTTP logs
   - All API calls

2. **`error.log`**
   - Application errors only
   - Failed requests
   - Exception stack traces

3. **`combined.log`**
   - Everything combined
   - All log levels
   - Complete application history

### Log Rotation:
- Maximum file size: **5MB**
- Maximum files kept: **5 files**
- Older logs are automatically deleted

## 🎨 Log Levels

The system uses different log levels for different types of information:

| Level | Description | Example Use Case |
|-------|-------------|------------------|
| `error` | Errors and exceptions | Database connection failed |
| `warn` | Warning messages | API rate limit approaching |
| `info` | General information | User logged in successfully |
| `http` | HTTP requests | GET /api/users 200 150ms |
| `debug` | Debugging information | Processing payment step 3 |

### Setting Log Level

In your `.env` file:
```env
LOG_LEVEL=info
```

**Options:** `error`, `warn`, `info`, `http`, `debug`

**Note:** Setting to `info` will show `error`, `warn`, `info`, and `http` logs.

## 🚀 How to Use the Logger

### In Your Code

```javascript
const logger = require('./utils/logger');

// Info log
logger.info('User created successfully', {
  userId: '123',
  email: 'user@example.com'
});

// Error log
logger.error('Database query failed', {
  error: error.message,
  stack: error.stack,
  query: 'SELECT * FROM users'
});

// Warning log
logger.warn('High memory usage detected', {
  usage: '85%',
  threshold: '80%'
});

// Debug log
logger.debug('Processing payment', {
  step: 'validation',
  amount: 99.99
});
```

### Automatic Logging

The following are **automatically logged** without any code needed:

✅ All HTTP requests (method, URL, headers, body)  
✅ All HTTP responses (status, timing, body)  
✅ All errors (with full context)  
✅ 404 Not Found routes  
✅ Unhandled promise rejections  
✅ Uncaught exceptions  

## 📊 Log Format

### Console Output (Development)
```
2025-10-12 08:30:45 [info]: Server started successfully on port 5000 in development mode
2025-10-12 08:31:02 [http]: ::1 - - [12/Oct/2025:08:31:02 +0000] "GET /api/health HTTP/1.1" 200 85 "-" "PostmanRuntime/7.32.3" 15.23 ms
2025-10-12 08:31:02 [info]: Incoming Request {
  "method": "GET",
  "url": "/api/health",
  "ip": "::1",
  "query": {},
  "params": {}
}
2025-10-12 08:31:02 [info]: Successful Response {
  "method": "GET",
  "url": "/api/health",
  "statusCode": 200,
  "responseTime": 15
}
```

### Log File Format (JSON)
```json
{
  "timestamp": "2025-10-12 08:31:02",
  "level": "info",
  "message": "User created successfully",
  "userId": "123",
  "email": "user@example.com",
  "service": "pos-dashboard-api"
}
```

## 🔍 Viewing Logs

### Real-time Console Logs
```bash
cd backend
npm run dev
```

### View Log Files

**View last 50 lines of error logs:**
```bash
tail -n 50 backend/logs/error.log
```

**Follow error logs in real-time:**
```bash
tail -f backend/logs/error.log
```

**Follow all logs in real-time:**
```bash
tail -f backend/logs/combined.log
```

**View access logs:**
```bash
tail -f backend/logs/access.log
```

**Search for specific errors:**
```bash
grep "Database" backend/logs/error.log
```

**View logs from last hour:**
```bash
grep "$(date -u +"%Y-%m-%d %H")" backend/logs/combined.log
```

## 🔒 Security Features

### Automatic Security Measures:

1. **Password Hiding**
   - All password fields are automatically replaced with `***HIDDEN***` in logs
   
2. **Git Ignored**
   - Log files are automatically excluded from git
   - No sensitive data in version control

3. **Sensitive Data Protection**
   - Configure additional fields to hide in `requestLogger.js`

### Adding More Protected Fields:

Edit `backend/middleware/requestLogger.js`:
```javascript
// Hide sensitive data
if (requestLog.body) {
  if (requestLog.body.password) requestLog.body.password = '***HIDDEN***';
  if (requestLog.body.ssn) requestLog.body.ssn = '***HIDDEN***';
  if (requestLog.body.creditCard) requestLog.body.creditCard = '***HIDDEN***';
}
```

## 🧪 Testing the Logging System

### Test Health Check (with logging)
```bash
curl http://localhost:5000/api/health
```

### Test Error Logging (Development only)
```bash
curl http://localhost:5000/api/test-error
```

### Test 404 Logging
```bash
curl http://localhost:5000/api/nonexistent-route
```

After these requests, check your console and log files to see the comprehensive logging in action!

## 📝 Example Logs

### Example 1: Successful API Request
```
[info]: Incoming Request {
  "method": "POST",
  "url": "/api/users",
  "ip": "192.168.1.100",
  "body": {
    "email": "john@example.com",
    "name": "John Doe",
    "password": "***HIDDEN***"
  }
}

[info]: Successful Response {
  "method": "POST",
  "url": "/api/users",
  "statusCode": 201,
  "responseTime": 234,
  "responseBody": {
    "success": true,
    "userId": "abc123"
  }
}
```

### Example 2: Error Log
```
[error]: Application Error {
  "message": "User not found",
  "stack": "Error: User not found\n    at UserController.getUser...",
  "method": "GET",
  "url": "/api/users/999",
  "statusCode": 404,
  "ip": "192.168.1.100"
}
```

### Example 3: Database Connection
```
[info]: MongoDB Connected: cluster0.mongodb.net
[info]: Server started successfully on port 5000 in development mode
[info]: Access logs available at: ./logs/access.log
[info]: Error logs available at: ./logs/error.log
[info]: Combined logs available at: ./logs/combined.log
```

## 🛠️ Customization

### Change Log File Locations

Edit `backend/utils/logger.js`:
```javascript
const logsDir = path.join(__dirname, '../logs'); // Change this path
```

### Change Log Rotation Settings

Edit `backend/utils/logger.js`:
```javascript
new winston.transports.File({
  filename: 'error.log',
  maxsize: 5242880, // 5MB - change this
  maxFiles: 5,      // Keep 5 files - change this
})
```

### Add Custom Log Formats

Edit `backend/utils/logger.js` to customize the format.

## 📚 Additional Resources

### Winston Documentation
https://github.com/winstonjs/winston

### Morgan Documentation
https://github.com/expressjs/morgan

## ✅ Best Practices

1. **Use appropriate log levels**
   - Don't use `error` for warnings
   - Don't use `info` for debugging

2. **Include context**
   - Always include relevant IDs (userId, orderId, etc.)
   - Include timestamps when relevant

3. **Don't log sensitive data**
   - Never log raw passwords
   - Be careful with personal information
   - Mask credit card numbers

4. **Monitor log file sizes**
   - Rotation is automatic, but monitor disk usage
   - Consider external log management for production

5. **Regular log review**
   - Check error logs daily
   - Look for patterns in warnings
   - Use logs for debugging and optimization

## 🎉 Summary

Your POS Dashboard now has **enterprise-grade logging** that will help you:

✅ Debug issues quickly  
✅ Monitor application health  
✅ Track user behavior  
✅ Identify performance bottlenecks  
✅ Audit API usage  
✅ Detect security issues  
✅ Maintain compliance  

**All logging is automatic** - just start your server and everything will be logged!

```bash
cd backend
npm install
npm run dev
```

Then make some API calls and watch the comprehensive logs appear in your console and log files! 🚀

