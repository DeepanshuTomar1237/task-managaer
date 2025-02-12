import request from "supertest";
import app from "../../app"; // Ensure app.js exports the Express instance
import User from "../../models/User";
import bcrypt from "bcrypt";
import { createAccessToken } from "../../utils/token";
import { validateEmail } from "../../utils/validation";

jest.mock("../../models/User"); // Mock Mongoose User model
jest.mock("bcrypt");
jest.mock("../../utils/token");
jest.mock("../../utils/validation");

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Signup", () => {
    it("should return 400 if fields are missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({});
      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Please fill all the fields");
    });

    it("should return 400 if email is invalid", async () => {
      validateEmail.mockReturnValue(false);
      const res = await request(app).post("/api/auth/signup").send({
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      });
      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Invalid Email");
    });

    it("should return 400 if password is too short", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "123",
      });
      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Password length must be at least 4 characters");
    });

    it("should return 400 if email already exists", async () => {
      User.findOne.mockResolvedValue({ email: "test@example.com" });
      const res = await request(app).post("/api/auth/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("This email is already registered");
    });

    it("should return 200 if user is created successfully", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      User.create.mockResolvedValue({ name: "Test User", email: "test@example.com" });

      const res = await request(app).post("/api/auth/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.msg).toBe("Congratulations!! Account has been created for you..");
    });
  });

  describe("Login", () => {
    it("should return 400 if email or password is missing", async () => {
      const res = await request(app).post("/api/auth/login").send({});
      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Please enter all details!!");
    });

    it("should return 400 if email is not registered", async () => {
      User.findOne.mockResolvedValue(null);
      const res = await request(app).post("/api/auth/login").send({
        email: "notfound@example.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("This email is not registered!!");
    });

    it("should return 400 if password is incorrect", async () => {
      const mockUser = { email: "test@example.com", password: "hashedPassword" };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Password incorrect!!");
    });

    it("should return 200 and token if login is successful", async () => {
      const mockUser = { _id: "user123", email: "test@example.com", password: "hashedPassword" };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      createAccessToken.mockReturnValue("mockedToken");

      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe("mockedToken");
      expect(res.body.msg).toBe("Login successful..");
    });
  });
});
