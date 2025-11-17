// Import required packages
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

/**
 * SIGNUP CONTROLLER
 * Handles user registration
 * - Validates user input
 * - Checks if user already exists
 * - Hashes password using bcrypt
 * - Creates new user in database
 * - Returns JWT token for authentication
 */
const signup = async (req, res) => {
  try {
    // Extract user data from request body
    const { name, email, password } = req.body;

    // Validate that all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, and password",
      });
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate password length (minimum 8 characters)
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Check if user with this email already exists in database
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash the password using bcrypt with salt rounds of 10
    // This makes the password secure before storing in database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user object with hashed password
    const newUser = new User({
      name,
      email: email.toLowerCase(), // Store email in lowercase for consistency
      password: hashedPassword,
      conversation: [], // Initialize empty conversation array
    });

    // Save the new user to database
    await newUser.save();

    // Generate JWT token for authentication
    // Token contains user ID and email, expires in 7 days
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send success response with user data and token
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        token,
      },
    });
  } catch (error) {
    // Log error for debugging
    console.error("Signup error:", error);
    
    // Send error response
    res.status(500).json({
      success: false,
      message: "An error occurred during registration",
      error: error.message,
    });
  }
};

/**
 * LOGIN CONTROLLER
 * Handles user authentication
 * - Validates user credentials
 * - Checks if user exists
 * - Compares password with hashed password
 * - Returns JWT token on successful login
 */
const login = async (req, res) => {
  try {
    // Extract credentials from request body
    const { email, password } = req.body;

    // Validate that both email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // Find user by email in database
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // If user doesn't exist, return error
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare provided password with hashed password in database
    // bcrypt.compare automatically handles the hashing and comparison
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    // If password doesn't match, return error
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token for authenticated user
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send success response with user data and token
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    // Log error for debugging
    console.error("Login error:", error);
    
    // Send error response
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
      error: error.message,
    });
  }
};

// Export the controller functions
module.exports = {
  signup,
  login,
};
