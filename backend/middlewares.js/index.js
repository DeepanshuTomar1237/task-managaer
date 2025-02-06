
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ACCESS_TOKEN_SECRET } = process.env;

// Middleware to verify the user's access token
exports.verifyAccessToken = async (req, res, next) => {

  const token = req.header("Authorization");
  
  if (!token) return res.status(400).json({ status: false, msg: "Token not found" });

  let user;
  try {
    // Verify the token using the secret key stored in environment variables
    user = jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (err) {
    return res.status(401).json({ status: false, msg: "Invalid token" });
  }

  try {
    user = await User.findById(user.id);

    if (!user) {
      return res.status(401).json({ status: false, msg: "User not found" });
    }

    // Attach the user object to the request object for further use
    req.user = user;

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};
