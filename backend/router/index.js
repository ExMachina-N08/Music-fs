const express = require("express");
const userRoutes = require("./user");
const artistRoutes = require("./artist");
const adminRoutes = require("./admin");
const uploadRoutes = require("./uploadRoutes");
const postRoutes = require("./post");
const getData = require("./getAlbumRoutes"); // Correctly imported

const router = express.Router();

// Use specific routes
router.use("/user", userRoutes);
router.use("/artist", artistRoutes);
router.use("/admin", adminRoutes);
router.use("/upload", uploadRoutes);
router.use("/post", postRoutes);
router.use("/get", getData); // Registered here

module.exports = router;
