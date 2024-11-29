const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set upload directories
const imageUploadPath = path.join(__dirname, '../uploads/images');
const videoUploadPath = path.join(__dirname, '../uploads/videos');

// Ensure directories exist
if (!fs.existsSync(imageUploadPath)) {
  fs.mkdirSync(imageUploadPath, { recursive: true });
}
if (!fs.existsSync(videoUploadPath)) {
  fs.mkdirSync(videoUploadPath, { recursive: true });
}

// Set storage engine with absolute paths
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.mimetype.startsWith('image/') ? imageUploadPath : videoUploadPath;
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Check file type
const checkFileType = (file, cb) => {
  const videoFileTypes = /mp4|mov|avi|mkv/;
  const imageFileTypes = /jpeg|jpg|png|gif/;

  const isVideo = videoFileTypes.test(path.extname(file.originalname).toLowerCase()) && file.mimetype.startsWith('video/');
  const isImage = imageFileTypes.test(path.extname(file.originalname).toLowerCase()) && file.mimetype.startsWith('image/');

  if (isVideo || isImage) {
    cb(null, true);
  } else {
    cb('Error: Only images and videos are allowed!');
  }
};

// Configure multer to handle multiple fields
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'imageFile', maxCount: 1 },
]);

module.exports = { upload };
