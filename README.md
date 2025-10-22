# POS Dashboard

A full-stack Point of Sale (POS) Dashboard built with the MERN stack.

## Project Structure

```
POS-Dashboard/
├── backend/                # Backend Node.js/Express server
│   ├── config/            # Configuration files (database, etc.)
│   ├── controllers/       # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── server.js          # Server entry point
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variables example
│
├── frontEnd/              # Frontend React application
│   ├── public/            # Public assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context/state management
│   │   ├── utils/         # Utility functions
│   │   ├── assets/        # Images, styles, etc.
│   │   ├── App.js         # Main App component
│   │   └── index.js       # Entry point
│   └── package.json       # Frontend dependencies
│
└── README.md              # This file
```

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Context API** - State management

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```bash
   echo "PORT=5173" > .env
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The frontend application will run on `http://localhost:5173`

### Run Both Backend and Frontend Together

From the root directory, you can run both servers simultaneously:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend application on `http://localhost:5173`

## Features

### QR Code Table Management

The application includes a QR code generation feature for restaurant tables:

- Generate QR codes for each table
- Encrypted table data (tableName and tableId) for security
- When scanned, customers are automatically redirected to the login page with encrypted table information
- QR codes can be downloaded as PNG images for printing

**QR Code URL Format:**
```
http://192.168.1.7:5173/login?token=<encrypted_table_data>
```

The encryption uses Base64 encoding for basic obfuscation of table information.

**Encryption Utilities:**
Located in `frontend/src/utils/encryption.js`, provides:
- `encrypt(value)` - Encrypt a single value
- `decrypt(encryptedValue)` - Decrypt a value
- `encryptParams(params)` - Encrypt multiple parameters into a token
- `decryptParams(token)` - Decrypt parameters from a token

## API Endpoints

(To be documented as routes are implemented)

## Contributing

(To be documented)

## License

ISC


