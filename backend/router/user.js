// routes/userRoutes.js
const express = require("express");
const {
  createUser,
  loginUser,
  updateUser,
  patchUser,
  deleteUser,
} = require("../controllers/user");
const authentication = require("../middleware/authentication");

const router = express.Router();

// User registration and login routes
router.post("/register", createUser);
router.post("/login", loginUser);

// User profile routes
router.get("/:id/profile", authentication, (req, res) => {
  const userId = req.params.id;
  if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
  }
  const showDetail = req.query.showDetail;
  const message = `Welcome to profile page, User ${req.user.username}`;
  if (showDetail === "true") res.status(200).json({ message, role: req.user.role });
});

// Update and delete user routes
router.put("/:id/profile", authentication, updateUser);
router.patch("/:id/profile", authentication, patchUser);
router.delete("/:id/profile", authentication, deleteUser);

module.exports = router;
