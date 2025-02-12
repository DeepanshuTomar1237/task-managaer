import { someMiddleware } from "../../middlewares"; // Replace with actual middleware functions
import httpMocks from "node-mocks-http";

describe("Middleware Tests", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn(); // Mock next function
  });

  it("should call next() when middleware passes", () => {
    someMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 when authentication fails", () => {
    req.headers.authorization = ""; // Simulate missing token

    someMiddleware(req, res, next);
    
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ msg: "Unauthorized" }); // Example error response
  });
});
