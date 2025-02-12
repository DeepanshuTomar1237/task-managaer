const express = require("express");
const router = express.Router();
const { getTasks, getTask, postTask, putTask, deleteTask } = require("../controllers/taskControllers");
const { verifyAccessToken } = require("../middlewares/index.js");

// Initialize an Express router for handling task-related routes
// Requires authentication via verifyAccessToken middleware
router.get("/", verifyAccessToken, getTasks);

// GET /api/tasks/:taskId - Fetch a specific task by ID
router.get("/:taskId", verifyAccessToken, getTask);

// POST /api/tasks - Create a new task
router.post("/", verifyAccessToken, postTask);

// PUT /api/tasks/:taskId - Update an existing task by ID
router.put("/:taskId", verifyAccessToken, putTask);

// DELETE /api/tasks/:taskId - Delete a task by ID
router.delete("/:taskId", verifyAccessToken, deleteTask);
module.exports = router;
