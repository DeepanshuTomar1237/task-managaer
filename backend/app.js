const express = require("express"); 
const app = express(); 
const mongoose = require("mongoose"); 
const path = require("path"); 
const cors = require("cors"); 
require("dotenv").config(); 

// Import route handlers
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Middleware setup
app.use(express.json()); 
app.use(cors()); 

// Connect to MongoDB
const mongoUrl = process.env.MONGODB_URL;
mongoose.connect(mongoUrl, (err) => {
  if (err) throw err;
  console.log("Mongodb connected...");
});

// Define API routes
app.use("/api/auth", authRoutes); 
app.use("/api/tasks", taskRoutes); 
app.use("/api/profile", profileRoutes); 
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/build"))); 
  app.get("*", (req, res) => 
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
  ); 
}

// Start the server on the specified port (default to 5000 if not set)
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend is running on port ${port}`); 
});
