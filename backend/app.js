const express = require("express"); // Import Express framework
const app = express(); // Create an instance of an Express application
const mongoose = require("mongoose"); // Import Mongoose for MongoDB connection
const path = require("path"); // Import Path module for handling file paths
const cors = require("cors"); // Import CORS middleware to allow cross-origin requests
require("dotenv").config(); // Load environment variables from a .env file

// Import route handlers
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for handling cross-origin requests

// Connect to MongoDB
const mongoUrl = process.env.MONGODB_URL;
mongoose.connect(mongoUrl, (err) => {
  if (err) throw err;
  console.log("Mongodb connected..."); // Log a success message if the connection is successful
});

// Define API routes
app.use("/api/auth", authRoutes); // Routes for authentication-related operations
app.use("/api/tasks", taskRoutes); // Routes for task management
app.use("/api/profile", profileRoutes); // Routes for user profile management

// Serve frontend files in production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/build"))); // Serve static files from the frontend build folder
  app.get("*", (req, res) => 
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
  ); // Serve the React app for any unknown routes
}

// Start the server on the specified port (default to 5000 if not set)
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend is running on port ${port}`); // Log that the server is running
});
