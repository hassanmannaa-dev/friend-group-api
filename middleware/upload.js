const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (we'll upload to Supabase)
const storage = multer.memoryStorage();

// File filter to only allow images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|wmv|flv|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

// Configure upload limits
const limits = {
  fileSize: 50 * 1024 * 1024, // 50MB limit
  files: 1 // Only one file per request
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

module.exports = upload; 