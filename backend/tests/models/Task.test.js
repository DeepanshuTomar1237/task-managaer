const mongoose = require("mongoose");
const Task = require("../../models/Task");

describe("Task Model", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a task successfully with valid data", async () => {
    const taskData = {
      user: new mongoose.Types.ObjectId(),
      description: "Test task",
    };

    const task = new Task(taskData);
    await task.validate();

    expect(task.user).toEqual(taskData.user);
    expect(task.description).toBe("Test task");
  });

  it("should fail validation if user is missing", async () => {
    const taskData = {
      description: "Test task",
    };

    const task = new Task(taskData);
    let err;

    try {
      await task.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.user).toBeDefined();
  });

  it("should fail validation if description is missing", async () => {
    const taskData = {
      user: new mongoose.Types.ObjectId(),
    };

    const task = new Task(taskData);
    let err;

    try {
      await task.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.description).toBeDefined();
  });

  it("should have timestamps by default", async () => {
    const taskData = {
      user: new mongoose.Types.ObjectId(),
      description: "Test task",
    };

    const task = new Task(taskData);
    await task.save();

    expect(task.createdAt).toBeDefined();
    expect(task.updatedAt).toBeDefined();
  });
});
