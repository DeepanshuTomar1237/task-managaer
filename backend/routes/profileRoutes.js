const express = require("express");  
const router = express.Router();  
const { getProfile } = require("../controllers/profileControllers");  
const { verifyAccessToken } = require("../middlewares/index.js");  

// Initialize an Express router for handling profile-related routes  

// Routes beginning with /api/profile  
// verifyAccessToken middleware ensures only authenticated users can access this route  
router.get("/", verifyAccessToken, getProfile);  

module.exports = router;  
