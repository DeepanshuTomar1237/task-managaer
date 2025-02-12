const mongoose = require("mongoose");
const User = require("../../models/User");

describe("User Model", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a user successfully with valid data", async () => {
    const userData = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "securepassword",
    };

    const user = new User(userData);
    await user.validate();

    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).toBe(userData.password);
    expect(user.joiningTime).toBeDefined();
  });

  it("should fail validation if name is missing", async () => {
    const userData = {
      email: "johndoe@example.com",
      password: "securepassword",
    };

    const user = new User(userData);
    let err;

    try {
      await user.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
  });

  it("should fail validation if email is missing", async () => {
    const userData = {
      name: "John Doe",
      password: "securepassword",
    };

    const user = new User(userData);
    let err;

    try {
      await user.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.email).toBeDefined();
  });

  it("should fail validation if password is missing", async () => {
    const userData = {
      name: "John Doe",
      email: "johndoe@example.com",
    };

    const user = new User(userData);
    let err;

    try {
      await user.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it("should enforce unique email constraint", async () => {
    const userData = {
      name: "John Doe",
      email: "duplicate@example.com",
      password: "securepassword",
    };

    await User.create(userData);

    let err;
    try {
      await User.create(userData);
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // MongoDB duplicate key error code
  });

  it("should have timestamps by default", async () => {
    const userData = {
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "securepassword",
    };

    const user = new User(userData);
    await user.save();

    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });
});
