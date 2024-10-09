// routes/postRoutes.js
const express = require("express");
const {
  createPost,
  getPostWithComments,
} = require("../controllers/postInteraction");
const authentication = require("../middleware/authentication");

const router = express.Router();

// Create a new post
router.post("/:id/post", authentication, createPost);

// Get a post with comments
router.get("/:id/post/:postId", authentication, getPostWithComments);

module.exports = router;
