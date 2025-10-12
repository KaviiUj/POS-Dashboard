const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Upload image route (Admin only)
router.post('/image', protect, authorize(99), upload.single('image'), uploadImage);

module.exports = router;
