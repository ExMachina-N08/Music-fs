// index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const createError = require("http-errors");
const path = require("path"); // Added for serving frontend files

// Import routes
const router = require("./router/index");
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

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

// Middleware for parsing JSON
app.use(express.json());

// Register routes
app.use("/api", router);
app.use("/api/cloudinary", cloudinaryTest);

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all route to serve index.html for any unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Catch-all for 404
app.use((req, res, next) => {
  next(createError(404, "Not Found"));
});

// Error-handling middleware with four parameters
app.use((err, req, res, next) => {
  // Note the 'next' parameter is needed
  console.log(err.stack);
  res.status(err.status || 500).send(err.message);
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
