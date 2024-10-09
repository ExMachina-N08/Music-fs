const multer = require("multer");

// Memory storage to temporarily hold files in memory
const storage = multer.memoryStorage();

// File filter to accept only images and audio files
const fileFilter = (req, file, cb) => {
  const allowedMIMETypes = [
    "image/jpeg",
    "image/png",
    "image/jpg", // Image types
    "audio/mpeg",
    "audio/wav",
    "audio/flac", // Audio types
  ];

  if (allowedMIMETypes.includes(file.mimetype)) {
    cb(null, true); // File is accepted
  } else {
    cb(new Error("Only images and audio files are allowed!"), false); // File rejected
  }
};

// Configure multer to use the defined storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // Limit file size to 100MB
  },
});

module.exports = upload;
