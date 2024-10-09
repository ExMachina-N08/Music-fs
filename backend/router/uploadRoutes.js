const express = require("express");
const { uploadAlbum } = require("../controllers/uploadContronller");
const upload = require("../config/multer"); // Your multer configuration
const { uploadCoverImage } = require("../controllers/uploadCoverController");

const router = express.Router();

// Route for uploading albums (cover image and songs)
router.post(
  "/album",
  upload.fields([
    // { name: "coverImage", maxCount: 1 }, // Single cover image
    { name: "songs", maxCount: 20 },
  ]),
  uploadAlbum
);
// Route for uploading cover image
router.post("/cover", upload.single("coverImage"), (req, res, next) => {
  console.log("Upload cover image route hit!");
  uploadCoverImage(req, res);
});

module.exports = router;
