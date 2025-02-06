const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = process.env; 

/**
 * Generates an access token using JWT
 * @param {Object} payload - The data to be included in the token (e.g., user ID, roles)
 * @returns {string} - A signed JWT access token
 */
const createAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET); // Sign the token using the secret key
}

module.exports = {
  createAccessToken, // Export the function for use in other parts of the application
}
