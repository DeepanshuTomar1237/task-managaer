// Import the Task model and the validation utility for object IDs
const Task = require("../models/Task");
const { validateObjectId } = require("../utils/validation");

// Controller function to get all tasks for the authenticated user
exports.getTasks = async (req, res) => {
  try {
    // Fetch tasks that belong to the current user
    const tasks = await Task.find({ user: req.user.id });
    
    // Respond with the found tasks
    res.status(200).json({ tasks, status: true, msg: "Tasks found successfully.." });
  } catch (err) {
    // Handle any errors that occur and return a server error
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

// Controller function to get a single task by ID
exports.getTask = async (req, res) => {
  try {
    // Validate the provided task ID
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task ID not valid" });
    }

    // Find the task belonging to the authenticated user
    const task = await Task.findOne({ user: req.user.id, _id: req.params.taskId });
    
    // Handle if the task is not found
    if (!task) {
      return res.status(400).json({ status: false, msg: "No task found.." });
    }
    
    // Return the found task
    res.status(200).json({ task, status: true, msg: "Task found successfully.." });
  } catch (err) {
    // Handle any errors that occur and return a server error
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

// Controller function to create a new task
exports.postTask = async (req, res) => {
  try {
    // Destructure the task data from the request body
    const { description, dueDate, dueTime, priority } = req.body;

    // Check if a description is provided
    if (!description) {
      return res.status(400).json({ status: false, msg: "Description of task not found" });
    }

    // Ensure that due date, due time, and priority are provided
    if (!dueDate || !dueTime || !priority) {
      return res.status(400).json({ status: false, msg: "Due date, time, or priority not provided" });
    }

    // Combine due date and time into a single date object
    const combinedDueDateTime = new Date(`${dueDate}T${dueTime}`);
    if (isNaN(combinedDueDateTime.getTime())) {
      return res.status(400).json({ status: false, msg: "Invalid date or time format" });
    }

    // Create a new task for the authenticated user
    const task = await Task.create({
      user: req.user.id,
      description,
      dueDate: combinedDueDateTime,
      priority,
    });

    // Return the created task
    res.status(200).json({ task, status: true, msg: "Task created successfully.." });
  } catch (err) {
    // Handle any errors that occur and return a server error
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

// Controller function to update an existing task
exports.putTask = async (req, res) => {
  try {
    // Destructure the updated task data from the request body
    const { description, dueDate, dueTime, priority } = req.body;

    // Check if a description is provided
    if (!description) {
      return res.status(400).json({ status: false, msg: "Description of task not found" });
    }

    // Validate the provided task ID
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task ID not valid" });
    }

    // Combine the new due date and time into a single date object
    const combinedDueDateTime = new Date(`${dueDate}T${dueTime}`);
    if (isNaN(combinedDueDateTime.getTime())) {
      return res.status(400).json({ status: false, msg: "Invalid date or time format" });
    }

    // Find the task by its ID
    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(400).json({ status: false, msg: "Task with given ID not found" });
    }

    // Check if the task belongs to the authenticated user
    if (task.user != req.user.id) {
      return res.status(403).json({ status: false, msg: "You can't update task of another user" });
    }

    // Update the task with the new details
    task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { description, dueDate: combinedDueDateTime, priority },
      { new: true }
    );

    // Return the updated task
    res.status(200).json({ task, status: true, msg: "Task updated successfully.." });
  } catch (err) {
    // Handle any errors that occur and return a server error
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

// Controller function to delete a task
exports.deleteTask = async (req, res) => {
  try {
    // Validate the provided task ID
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task ID not valid" });
    }

    // Find the task by its ID
    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(400).json({ status: false, msg: "Task with given ID not found" });
    }

    // Check if the task belongs to the authenticated user
    if (task.user != req.user.id) {
      return res.status(403).json({ status: false, msg: "You can't delete task of another user" });
    }

    // Delete the task from the database
    await Task.findByIdAndDelete(req.params.taskId);
    
    // Respond with a success message
    res.status(200).json({ status: true, msg: "Task deleted successfully.." });
  } catch (err) {
    // Handle any errors that occur and return a server error
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};
