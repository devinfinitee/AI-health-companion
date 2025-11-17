// Import express and create router instance
let express = require("express");
let Router = express.Router();

// Import authentication controller functions
const { signup, login } = require("./authController");

// Import appointment controller functions
const {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
} = require("./appointmentController");

// Import authentication middleware for protecting routes
const authMiddleware = require("../middleware/authMiddleware");

// Authentication routes
// POST /signup - Register a new user
Router.post("/signup", signup);

// POST /login - Authenticate existing user
Router.post("/login", login);

// Protected routes - require authentication
// These routes use authMiddleware to verify JWT token
// The authenticated user data is available in req.user

// GET /dashboard/health/summary - Get user's health summary (protected)
Router.get("/dashboard/health/summary", authMiddleware, (req, res) => {
  // TODO: Implement health summary logic
  // Access authenticated user via req.user
  res.json({
    success: true,
    message: "Health summary endpoint",
    user: req.user,
  });
});

// POST /dashboard/symptoms - Submit symptoms (protected)
Router.post("/dashboard/symptoms", authMiddleware, (req, res) => {
  // TODO: Implement symptoms submission logic
  // Access authenticated user via req.user
  res.json({
    success: true,
    message: "Symptoms endpoint",
    user: req.user,
  });
});

// GET /dashboard/previous/conversation - Get user's conversation history (protected)
Router.get("/dashboard/previous/conversation", authMiddleware, (req, res) => {
  // TODO: Implement conversation history logic
  // Access authenticated user via req.user
  res.json({
    success: true,
    message: "Conversation history endpoint",
    user: req.user,
  });
});

// Appointment routes - all protected with authentication
// POST /appointments - Create a new appointment
Router.post("/appointments", authMiddleware, createAppointment);

// GET /appointments - Get all appointments for the authenticated user
Router.get("/appointments", authMiddleware, getUserAppointments);

// GET /appointments/:id - Get a specific appointment by ID
Router.get("/appointments/:id", authMiddleware, getAppointmentById);

// PUT /appointments/:id - Update an appointment
Router.put("/appointments/:id", authMiddleware, updateAppointment);

// DELETE /appointments/:id - Cancel an appointment
Router.delete("/appointments/:id", authMiddleware, cancelAppointment);

// Health check route
Router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "StoryGenius API is running",
  });
});

// Export the router
module.exports = Router;
