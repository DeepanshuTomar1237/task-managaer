
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,                        
    required: [true, "Please enter your name"],
    trim: true                        
  },
  // Define the 'email' field, which is a required string, unique, and will be trimmed
  email: {
    type: String,                       
    required: [true, "Please enter your email"],
    trim: true,                         
    unique: true                        
  },
  // Define the 'password' field, which is a required string
  password: {
    type: String,                       
    required: [true, "Please enter your password"], 
  },
  // Define the 'joiningTime' field, which defaults to the current date/time when the user is created
  joiningTime: {
    type: Date,                          
    default: Date.now                 
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
