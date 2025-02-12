const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("../../routes/authRoutes");
const User = require("../../models/User");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth Routes", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear the User collection before running tests
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user successfully", async () => {
      const response = await request(app).post("/api/auth/signup").send({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "securepassword",
      });

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe("Congratulations!! Account has been created for you..");
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app).post("/api/auth/signup").send({
        email: "johndoe@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Please fill all the fields");
    });

    it("should return 400 if email is already registered", async () => {
      await User.create({
        name: "John Doe",
        email: "duplicate@example.com",
        password: "securepassword",
      });

      const response = await request(app).post("/api/auth/signup").send({
        name: "Jane Doe",
        email: "duplicate@example.com",
        password: "anotherpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("This email is already registered");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeAll(async () => {
      await User.create({
        name: "Existing User",
        email: "existing@example.com",
        password: await require("bcrypt").hash("password123", 10),
      });
    });

    it("should log in an existing user successfully", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "existing@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.msg).toBe("Login successful..");
    });

    it("should return 400 if email is not registered", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "notregistered@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("This email is not registered!!");
    });

    it("should return 400 if password is incorrect", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "existing@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Password incorrect!!");
    });
  });
});
