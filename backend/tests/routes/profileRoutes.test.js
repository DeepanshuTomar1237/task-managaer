const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const profileRoutes = require("../../routes/profileRoutes");
const User = require("../../models/User");
const { verifyAccessToken } = require("../../middlewares");

const app = express();
app.use(express.json());
app.use("/api/profile", profileRoutes);

// Mock the verifyAccessToken middleware
jest.mock("../../middlewares", () => ({
  verifyAccessToken: (req, res, next) => {
    req.user = { id: "mockUserId" }; // Mock user ID for authentication
    next();
  },
}));

describe("Profile Routes", () => {
  let token;
  let user;

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
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /api/profile", () => {
    it("should return user profile when authenticated", async () => {
      const response = await request(app)
        .get("/api/profile")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.msg).toBe("Profile found successfully..");
    });

    it("should return 400 if no token is provided", async () => {
      const response = await request(app).get("/api/profile");

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.msg).toBe("Token not found");
    });

    it("should return 401 if token is invalid", async () => {
      const response = await request(app)
        .get("/api/profile")
        .set("Authorization", "invalidtoken");

      expect(response.status).toBe(401);
      expect(response.body.status).toBe(false);
      expect(response.body.msg).toBe("Invalid token");
    });
  });
});
