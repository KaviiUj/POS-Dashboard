const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/images');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Check if this is a logo upload (based on original filename)
    if (file.originalname === 'app-logo.png' || file.fieldname === 'logo') {
      const extension = path.extname(file.originalname);
      cb(null, `app-logo${extension}`);
    } else {
      // Generate unique filename with timestamp for regular items
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, `item-${uniqueSuffix}${extension}`);
    }
  }
});

// File filter for image validation
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Upload single image
const uploadImage = (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Get file information
    const file = req.file;
    
    // Get the protocol and host from the request
    const protocol = req.protocol; // 'http' or 'https'
    const host = req.get('host'); // 'localhost:3001' or your domain
    
    // Build the complete image URL
    const imageUrl = `${protocol}://${host}/uploads/images/${file.filename}`;
    
    logger.info('Image uploaded successfully', {
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      imageUrl: imageUrl,
      uploadedBy: req.user ? req.user.userId : 'anonymous'
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        imageUrl: imageUrl,
        size: file.size,
        mimetype: file.mimetype
      }
    });

  } catch (error) {
    logger.error('Error uploading image', {
      error: error.message,
      stack: error.stack,
      uploadedBy: req.user ? req.user.userId : 'anonymous'
    });

    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
};

module.exports = {
  upload,
  uploadImage
};
