// index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const createError = require("http-errors");
const router = require("./router/index"); // This should be the correct import
const cloudinaryTest = require("./router/cloudinaryTest");

dotenv.config();
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Enable Cors
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

// Middleware for parsing JSON
app.use(express.json());

// Register routes
app.use("/api", router); // This ensures all routes under /api/ go to the correct router

// Test Cloudinary Route
app.use("/api/cloudinary", cloudinaryTest);

// Catch-all for 404
app.use((req, res, next) => {
  next(createError(404, "Not Found"));
});

// Error-handling middleware with four parameters
app.use((err, req, res) => {
  console.log(err.stack);
  res.status(err.status || 500).send(err.message);
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
