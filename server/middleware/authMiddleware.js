// Import required packages
const jwt = require("jsonwebtoken");
const User = require("../model/User");

/**
 * AUTHENTICATION MIDDLEWARE
 * Protects routes by verifying JWT token
 * 
 * This middleware:
 * 1. Extracts the JWT token from the Authorization header
 * 2. Verifies the token is valid and not expired
 * 3. Finds the user in the database
 * 4. Attaches user data to the request object
 * 5. Allows the request to proceed to the next middleware/route handler
 * 
 * Usage:
 * Router.get("/protected-route", authMiddleware, (req, res) => {
 *   // Access authenticated user via req.user
 *   res.json({ user: req.user });
 * });
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    // Expected format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided",
      });
    }

    // Check if header starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format. Use: Bearer <token>",
      });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify the token using the JWT secret
    // This will throw an error if token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database using the ID from the token
    const user = await User.findById(decoded.userId).select("-password");

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user data to request object
    // This makes user data available in route handlers
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again",
      });
    }

    // Handle other errors
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

// Export the middleware
module.exports = authMiddleware;
