# POS Dashboard - Backend

Backend API server for the POS Dashboard application built with Node.js, Express, and MongoDB.

## Features

- RESTful API architecture
- MongoDB database with Mongoose ODM
- JWT-based authentication
- Comprehensive logging system
- Error handling and validation
- CORS enabled

## Logging System

The backend includes a comprehensive logging system that tracks:

### Log Types

1. **HTTP Request Logs** - All incoming HTTP requests with:
   - Method, URL, IP address
   - User agent, headers
   - Query parameters, route params
   - Request body (excluding sensitive data)

2. **Response Logs** - All outgoing responses with:
   - Status code and message
   - Response time
   - Content type and length
   - Response body (for errors or small responses)

3. **Error Logs** - Detailed error information:
   - Error message and stack trace
   - Request context (URL, method, params)
   - User information
   - Timestamp

4. **Application Logs** - General application events:
   - Server startup/shutdown
   - Database connections
   - Important operations

### Log Files

Logs are stored in the `backend/logs/` directory:

- `access.log` - HTTP request logs
- `error.log` - Error logs only
- `combined.log` - All logs combined

### Log Levels

- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages
- `http` - HTTP request logs
- `debug` - Debug messages

### Log Configuration

You can configure the log level in your `.env` file:

```env
LOG_LEVEL=info  # Options: error, warn, info, http, debug
```

### Viewing Logs

**Real-time logs in console:**
```bash
npm run dev
```

**View specific log files:**
```bash
# View error logs
tail -f logs/error.log

# View access logs
tail -f logs/access.log

# View all logs
tail -f logs/combined.log
```

### Security

- Passwords and sensitive data are automatically hidden in logs
- Log files are excluded from git via `.gitignore`
- Log files are rotated (max 5 files of 5MB each)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env`

3. Start the server:
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server health status.

### Test Error (Development only)
```
GET /api/test-error
```
Tests error logging functionality.

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
LOG_LEVEL=info
```

## Project Structure

```
backend/
├── config/           # Configuration files
│   └── db.js        # Database connection
├── controllers/      # Route controllers
├── models/          # Mongoose models
├── routes/          # API routes
├── middleware/      # Custom middleware
│   ├── requestLogger.js   # Request/response logging
│   ├── errorLogger.js     # Error logging
│   └── morganLogger.js    # HTTP request logging
├── utils/           # Utility functions
│   └── logger.js    # Winston logger configuration
├── logs/            # Log files (auto-generated)
├── server.js        # Server entry point
├── package.json     # Dependencies
└── .env            # Environment variables
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Winston** - Logging library
- **Morgan** - HTTP request logger
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Error Handling

The application includes comprehensive error handling:

- Global error handler for all routes
- Automatic error logging
- Proper HTTP status codes
- Detailed error messages in development
- Secure error messages in production

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-restart
npm run dev

# Run in production mode
npm start
```

## License

ISC

