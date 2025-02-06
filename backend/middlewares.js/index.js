// Import the necessary modules (jsonwebtoken for token verification, User model for database operations)
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ACCESS_TOKEN_SECRET } = process.env;

// Middleware to verify the user's access token
exports.verifyAccessToken = async (req, res, next) => {
  // Get the token from the 'Authorization' header
  const token = req.header("Authorization");
  
  // If no token is provided, return a 400 status with an error message
  if (!token) return res.status(400).json({ status: false, msg: "Token not found" });

  let user;
  try {
    // Verify the token using the secret key stored in environment variables
    user = jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (err) {
    // If token is invalid, return a 401 status with an error message
    return res.status(401).json({ status: false, msg: "Invalid token" });
  }

  try {
    // Look for the user in the database by their ID from the decoded token
    user = await User.findById(user.id);

    // If the user is not found, return a 401 status with an error message
    if (!user) {
      return res.status(401).json({ status: false, msg: "User not found" });
    }

    // Attach the user object to the request object for further use
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If an error occurs during the database query, log the error and return a 500 status
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};
