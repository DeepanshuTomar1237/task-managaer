import request from "supertest";
import app from "../../app"; // Ensure app.js exports the Express instance
import User from "../../models/User";

jest.mock("../../models/User"); // Mock Mongoose User model

describe("Profile Controller", () => {
  let mockUser;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = {
      _id: "user123",
      name: "Test User",
      email: "test@example.com",
      password: "hashedPassword",
    };
  });

  describe("GET /api/profile", () => {
    it("should return 200 and user profile if valid request", async () => {
      User.findById.mockResolvedValue({ ...mockUser, password: undefined });

      const res = await request(app)
        .get("/api/profile")
        .set("Authorization", "Bearer validToken") // Assuming you have auth middleware

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.user.email).toBe(mockUser.email);
      expect(res.body.msg).toBe("Profile found successfully..");
    });

    it("should return 500 if an error occurs", async () => {
      User.findById.mockRejectedValue(new Error("Database error"));

      const res = await request(app)
        .get("/api/profile")
        .set("Authorization", "Bearer validToken");

      expect(res.status).toBe(500);
      expect(res.body.status).toBe(false);
      expect(res.body.msg).toBe("Internal Server Error");
    });
  });
});
