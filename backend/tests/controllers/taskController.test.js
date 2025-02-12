import request from "supertest";
import app from "../../app"; // Ensure app.js exports the Express instance
import Task from "../../models/Task";
import { validateObjectId } from "../../utils/validation";

jest.mock("../../models/Task"); // Mock Mongoose Task model
jest.mock("../../utils/validation", () => ({
  validateObjectId: jest.fn()
}));

describe("Task Controller", () => {
  let mockTask, mockUser;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = { id: "user123" };
    mockTask = { _id: "task123", user: "user123", description: "Test task" };
  });

  describe("GET /api/tasks", () => {
    it("should return 200 and a list of tasks", async () => {
      Task.find.mockResolvedValue([mockTask]);

      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", "Bearer validToken")
        .send();

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.tasks.length).toBe(1);
      expect(res.body.msg).toBe("Tasks found successfully..");
    });

    it("should return 500 if an error occurs", async () => {
      Task.find.mockRejectedValue(new Error("Database error"));

      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", "Bearer validToken");

      expect(res.status).toBe(500);
      expect(res.body.status).toBe(false);
      expect(res.body.msg).toBe("Internal Server Error");
    });
  });

  describe("GET /api/tasks/:taskId", () => {
    it("should return 400 if task ID is invalid", async () => {
      validateObjectId.mockReturnValue(false);

      const res = await request(app)
        .get("/api/tasks/invalidId")
        .set("Authorization", "Bearer validToken");

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Task id not valid");
    });

    it("should return 400 if task is not found", async () => {
      validateObjectId.mockReturnValue(true);
      Task.findOne.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/tasks/task123")
        .set("Authorization", "Bearer validToken");

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("No task found..");
    });

    it("should return 200 if task is found", async () => {
      validateObjectId.mockReturnValue(true);
      Task.findOne.mockResolvedValue(mockTask);

      const res = await request(app)
        .get("/api/tasks/task123")
        .set("Authorization", "Bearer validToken");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.task.description).toBe(mockTask.description);
    });
  });

  describe("POST /api/tasks", () => {
    it("should return 400 if description is missing", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", "Bearer validToken")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Description of task not found");
    });

    it("should create a task and return 200", async () => {
      Task.create.mockResolvedValue(mockTask);

      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", "Bearer validToken")
        .send({ description: "Test task" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.task.description).toBe(mockTask.description);
    });
  });

  describe("PUT /api/tasks/:taskId", () => {
    it("should return 400 if description is missing", async () => {
      const res = await request(app)
        .put("/api/tasks/task123")
        .set("Authorization", "Bearer validToken")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Description of task not found");
    });

    it("should return 400 if task ID is invalid", async () => {
      validateObjectId.mockReturnValue(false);

      const res = await request(app)
        .put("/api/tasks/task123")
        .set("Authorization", "Bearer validToken")
        .send({ description: "Updated task" });

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Task id not valid");
    });

    it("should return 400 if task is not found", async () => {
      validateObjectId.mockReturnValue(true);
      Task.findById.mockResolvedValue(null);

      const res = await request(app)
        .put("/api/tasks/task123")
        .set("Authorization", "Bearer validToken")
        .send({ description: "Updated task" });

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Task with given id not found");
    });

    it("should update a task and return 200", async () => {
      validateObjectId.mockReturnValue(true);
      Task.findById.mockResolvedValue(mockTask);
      Task.findByIdAndUpdate.mockResolvedValue({ ...mockTask, description: "Updated task" });

      const res = await request(app)
        .put("/api/tasks/task123")
        .set("Authorization", "Bearer validToken")
        .send({ description: "Updated task" });

      expect(res.status).toBe(200);
      expect(res.body.task.description).toBe("Updated task");
    });
  });

  describe("DELETE /api/tasks/:taskId", () => {
    it("should return 400 if task ID is invalid", async () => {
      validateObjectId.mockReturnValue(false);

      const res = await request(app)
        .delete("/api/tasks/task123")
        .set("Authorization", "Bearer validToken");

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Task id not valid");
    });

    it("should return 400 if task is not found", async () => {
      validateObjectId.mockReturnValue(true);
      Task.findById.mockResolvedValue(null);

      const res = await request(app)
        .delete("/api/tasks/task123")
        .set("Authorization", "Bearer validToken");

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Task with given id not found");
    });

    it("should delete a task and return 200", async () => {
      validateObjectId.mockReturnValue(true);
      Task.findById.mockResolvedValue(mockTask);
      Task.findByIdAndDelete.mockResolvedValue(mockTask);

      const res = await request(app)
        .delete("/api/tasks/task123")
        .set("Authorization", "Bearer validToken");

      expect(res.status).toBe(200);
      expect(res.body.msg).toBe("Task deleted successfully..");
    });
  });
});
