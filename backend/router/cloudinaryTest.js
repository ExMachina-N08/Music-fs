// routes/cloudinaryTest.js
const express = require("express");
const cloudinary = require("cloudinary").v2;
const router = express.Router();

// Define the test route
router.get("/test", async (req, res) => {
  try {
    // Check Cloudinary connection or upload a test image
    const result = await cloudinary.api.ping();
    res
      .status(200)
      .json({ message: "Cloudinary connected successfully!", result });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to connect to Cloudinary", error: err.message });
  }
});

module.exports = router;
