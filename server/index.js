// Load environment variables from .env file
require("dotenv").config();

// Import required packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Router = require("./controller/routes.js");

// Initialize express app
const app = express();

// Set port from environment variable or default to 5000
const PORT = process.env.PORT || 5001;

// MIDDLEWARE CONFIGURATION

// Enable CORS (Cross-Origin Resource Sharing) to allow frontend to communicate with backend
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5000"], // Allow both Vite ports
  credentials: true, // Allow cookies and authentication headers
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// DATABASE CONNECTION

// Connect to MongoDB using connection string from environment variables
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Exit process if database connection fails
  });

// ROUTES

// Mount all API routes with /api prefix
app.use("/api", Router);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// START SERVER

// Start listening on specified port
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
});
