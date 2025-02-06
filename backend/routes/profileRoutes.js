const express = require("express");  
const router = express.Router();  
const { getProfile } = require("../controllers/profileControllers");  
const { verifyAccessToken } = require("../middlewares.js");  

// Initialize an Express router for handling profile-related routes  

// Routes beginning with /api/profile  
// GET request to fetch user profile  
// verifyAccessToken middleware ensures only authenticated users can access this route  
router.get("/", verifyAccessToken, getProfile);  

// Export the router module for use in the main application  
module.exports = router;  
