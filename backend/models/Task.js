// Import mongoose to define a schema and interact with MongoDB
const mongoose = require("mongoose");

// Define the task schema for the Task model
const taskSchema = new mongoose.Schema({
  // Define the 'user' field, which is a reference to the User model (ObjectId)
  user: {
    type: mongoose.Schema.Types.ObjectId,  // Store the user ID as an ObjectId
    ref: "User",                           // Reference the User model
    required: true                         // Ensure this field is always provided
  },
  // Define the 'description' field to store the task details
  description: {
    type: String,                          // Store the task description as a string
    required: true                         // Ensure this field is always provided
  },
}, {
  // Automatically include 'createdAt' and 'updatedAt' timestamps
  timestamps: true
});

// Create the Task model based on the taskSchema
const Task = mongoose.model("Task", taskSchema);

// Export the Task model for use in other parts of the application
module.exports = Task;
