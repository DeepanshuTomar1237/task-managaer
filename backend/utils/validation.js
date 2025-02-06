const mongoose = require("mongoose"); // Import Mongoose for MongoDB-related operations

/**
 * Validates an email address using a regular expression pattern
 * @param {string} email - The email address to validate
 * @returns {Array|null} - Returns an array if the email is valid, otherwise null
 */
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

/**
 * Checks if a given string is a valid MongoDB ObjectId
 * @param {string} string - The string to validate
 * @returns {boolean} - Returns true if the string is a valid ObjectId, otherwise false
 */
const validateObjectId = (string) => {
  return mongoose.Types.ObjectId.isValid(string);
}

module.exports = {
  validateEmail, // Export the email validation function
  validateObjectId, // Export the ObjectId validation function
}
