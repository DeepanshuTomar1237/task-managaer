// Import mongoose to define a schema and interact with MongoDB
const mongoose = require("mongoose");

// Define the user schema for the User model
const userSchema = new mongoose.Schema({
  // Define the 'name' field, which is a required string and will be trimmed to remove extra spaces
  name: {
    type: String,                        // Store the user's name as a string
    required: [true, "Please enter your name"], // Make the name field required with a custom error message
    trim: true                            // Automatically trim any extra spaces around the name
  },
  // Define the 'email' field, which is a required string, unique, and will be trimmed
  email: {
    type: String,                        // Store the user's email as a string
    required: [true, "Please enter your email"], // Make the email field required with a custom error message
    trim: true,                           // Automatically trim any extra spaces around the email
    unique: true                          // Ensure the email is unique across the database
  },
  // Define the 'password' field, which is a required string
  password: {
    type: String,                        // Store the user's password as a string
    required: [true, "Please enter your password"], // Make the password field required with a custom error message
  },
  // Define the 'joiningTime' field, which defaults to the current date/time when the user is created
  joiningTime: {
    type: Date,                          // Store the joining time as a Date object
    default: Date.now                    // Default value is the current date and time
  }
}, {
  // Automatically include 'createdAt' and 'updatedAt' timestamps
  timestamps: true
});

// Create the User model based on the userSchema
const User = mongoose.model("User", userSchema);

// Export the User model for use in other parts of the application
module.exports = User;
