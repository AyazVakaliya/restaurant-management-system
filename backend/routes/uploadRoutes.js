const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin', 'manager'), upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  res.json({
    message: 'Image uploaded successfully',
    url: req.file.path,
  });
});

module.exports = router;