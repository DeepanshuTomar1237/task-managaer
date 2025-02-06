
const mongoose = require("mongoose");

// Define the task schema for the Task model
const taskSchema = new mongoose.Schema({
  // Define the 'user' field, which is a reference to the User model (ObjectId)
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",                          
    required: true                        
  },
  description: {
    type: String,                         
    required: true                        
  },
}, {
  
  timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
