// routes/adminRoutes.js
const express = require("express");
const { createAdmin, loginAdmin } = require("../controllers/admin");
const { getAllUsers } = require("../controllers/getAllUser");
const authentication = require("../middleware/authentication");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

// Admin registration and login routes
router.post("/register", createAdmin);
router.post("/login", loginAdmin);

// Admin dashboard and user management
router.get("/dashboard", authentication, isAdmin, (req, res) => {
  res.status(200).json({ message: `Welcome, Admin User: ${req.user.email}` });
});

router.get("/users", authentication, isAdmin, getAllUsers);

module.exports = router;
