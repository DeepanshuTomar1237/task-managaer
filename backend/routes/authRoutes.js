// Import express to create routing functionality
const express = require("express");

// Create a new router instance for handling authentication routes
const router = express.Router();

// Import the signup and login controller functions from the authControllers module
const { signup, login } = require("../controllers/authControllers");

// Define the route for user signup
// POST request to /api/auth/signup calls the signup function in authControllers
router.post("/signup", signup);

// Define the route for user login
// POST request to /api/auth/login calls the login function in authControllers
router.post("/login", login);

// Export the router so it can be used in other parts of the application
module.exports = router;
