// routes/artistRoutes.js
const express = require("express");
const { createUser } = require("../controllers/user"); // Assuming artist creation is handled in user controller
const { uploadAlbum } = require("../controllers/uploadContronller");
const authentication = require("../middleware/authentication");

const router = express.Router();

// Artist registration route
router.post("/register", createUser);

// Artist-specific album upload route
router.post("/album/upload", uploadAlbum);

module.exports = router;
