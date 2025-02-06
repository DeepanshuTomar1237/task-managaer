const User = require("../models/User"); 
const bcrypt = require("bcrypt"); 
const { createAccessToken } = require("../utils/token"); 
const { validateEmail } = require("../utils/validation"); 

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body; 
    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill all the fields" });
    }
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ msg: "Please send string values only" });
    }

    if (password.length < 4) {
      return res.status(400).json({ msg: "Password length must be at least 4 characters" });
    }

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
    console.error(err); 
    return res.status(500).json({ msg: "Internal Server Error" }); 
  }
}

// Login function to authenticate user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; 
    if (!email || !password) {
      return res.status(400).json({ status: false, msg: "Please enter all details!!" });
    }

    // Find user by email in the database
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ status: false, msg: "This email is not registered!!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ status: false, msg: "Password incorrect!!" });

    // Create an access token for the authenticated user
    const token = createAccessToken({ id: user._id });
    delete user.password; 
    res.status(200).json({ token, user, status: true, msg: "Login successful.." });
  }
  catch (err) {
    console.error(err); 
    return res.status(500).json({ status: false, msg: "Internal Server Error" }); 
  }
}
