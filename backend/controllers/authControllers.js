const User = require("../models/User"); // Import User model to interact with the user database
const bcrypt = require("bcrypt"); // Import bcrypt for hashing and comparing passwords
const { createAccessToken } = require("../utils/token"); // Import function to create JWT token
const { validateEmail } = require("../utils/validation"); // Import email validation function

// Signup function to register a new user
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Destructure request body to get name, email, and password
    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill all the fields" });
    }
    // Check if all fields are strings
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ msg: "Please send string values only" });
    }

    // Ensure password is at least 4 characters long
    if (password.length < 4) {
      return res.status(400).json({ msg: "Password length must be at least 4 characters" });
    }

    // Validate email format using the validateEmail function
    if (!validateEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    // Check if user with the same email already exists in the database
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "This email is already registered" });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user record in the database
    await User.create({ name, email, password: hashedPassword });
    res.status(200).json({ msg: "Congratulations!! Account has been created for you.." });
  }
  catch (err) {
    console.error(err); // Log any error that occurs during the process
    return res.status(500).json({ msg: "Internal Server Error" }); // Return server error if something goes wrong
  }
}

// Login function to authenticate user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // Destructure request body to get email and password
    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ status: false, msg: "Please enter all details!!" });
    }

    // Find user by email in the database
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ status: false, msg: "This email is not registered!!" });

    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ status: false, msg: "Password incorrect!!" });

    // Create an access token for the authenticated user
    const token = createAccessToken({ id: user._id });
    delete user.password; // Remove password from the response for security
    res.status(200).json({ token, user, status: true, msg: "Login successful.." });
  }
  catch (err) {
    console.error(err); // Log any error that occurs during the process
    return res.status(500).json({ status: false, msg: "Internal Server Error" }); // Return server error if something goes wrong
  }
}
