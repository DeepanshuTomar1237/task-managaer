const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const taskRoutes = require("../../routes/taskRoutes");
const Task = require("../../models/Task");
const User = require("../../models/User");

const app = express();
app.use(express.json());
app.use("/api/tasks", taskRoutes);

// Mock the verifyAccessToken middleware
jest.mock("../../middlewares", () => ({
  verifyAccessToken: (req, res, next) => {
    req.user = { id: "mockUserId" }; // Mock user ID for authentication
    next();
  },
}));

describe("Task Routes", () => {
  let token;
  let user;
  let task;

  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user
    user = await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    });

    // Generate a JWT token for authentication
    token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET || "testsecret");

    // Create a test task
    task = await Task.create({
      user: user._id,
      description: "Test Task",
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /api/tasks", () => {
    it("should return tasks for authenticated user", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.tasks).toBeDefined();
      expect(response.body.msg).toBe("Tasks found successfully..");
    });
  });

  describe("GET /api/tasks/:taskId", () => {
    it("should return a specific task", async () => {
      const response = await request(app)
        .get(`/api/tasks/${task._id}`)
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.task).toBeDefined();
      expect(response.body.msg).toBe("Task found successfully..");
    });

    it("should return 400 for invalid task ID", async () => {
      const response = await request(app)
        .get("/api/tasks/invalidId")
        .set("Authorization", token);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.msg).toBe("Task id not valid");
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", token)
        .send({ description: "New Test Task" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.task).toBeDefined();
      expect(response.body.msg).toBe("Task created successfully..");
    });

    it("should return 400 if description is missing", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", token)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.msg).toBe("Description of task not found");
    });
  });

  describe("PUT /api/tasks/:taskId", () => {
    it("should update an existing task", async () => {
      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set("Authorization", token)
        .send({ description: "Updated Test Task" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.task.description).toBe("Updated Test Task");
      expect(response.body.msg).toBe("Task updated successfully..");
    });

    it("should return 400 if task ID is invalid", async () => {
      const response = await request(app)
        .put("/api/tasks/invalidId")
        .set("Authorization", token)
        .send({ description: "Updated Test Task" });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.msg).toBe("Task id not valid");
    });
  });

  describe("DELETE /api/tasks/:taskId", () => {
    it("should delete a task", async () => {
      const newTask = await Task.create({ user: user._id, description: "Task to Delete" });

      const response = await request(app)
        .delete(`/api/tasks/${newTask._id}`)
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.msg).toBe("Task deleted successfully..");
    });

    it("should return 400 if task ID is invalid", async () => {
      const response = await request(app)
        .delete("/api/tasks/invalidId")
        .set("Authorization", token);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.msg).toBe("Task id not valid");
    });
  });
});
