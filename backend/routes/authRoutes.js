const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authControllers");

// Define the route for user signup
// POST request to /api/auth/signup calls the signup function in authControllers
router.post("/signup", signup);

// Define the route for user login
// POST request to /api/auth/login calls the login function in authControllers
router.post("/login", login);

module.exports = router;
