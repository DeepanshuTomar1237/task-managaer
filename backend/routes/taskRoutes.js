const express = require("express");
const router = express.Router();
const { getTasks, getTask, postTask, putTask, deleteTask } = require("../controllers/taskControllers");
const { verifyAccessToken } = require("../middlewares.js");

// Initialize an Express router for handling task-related routes

// Routes beginning with /api/tasks

// GET /api/tasks - Fetch all tasks
// Requires authentication via verifyAccessToken middleware
router.get("/", verifyAccessToken, getTasks);

// GET /api/tasks/:taskId - Fetch a specific task by ID
// Requires authentication
router.get("/:taskId", verifyAccessToken, getTask);

// POST /api/tasks - Create a new task
// Requires authentication
router.post("/", verifyAccessToken, postTask);

// PUT /api/tasks/:taskId - Update an existing task by ID
// Requires authentication
router.put("/:taskId", verifyAccessToken, putTask);

// DELETE /api/tasks/:taskId - Delete a task by ID
// Requires authentication
router.delete("/:taskId", verifyAccessToken, deleteTask);

// Export the router module for use in the main application
module.exports = router;
