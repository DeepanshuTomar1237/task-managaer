// Import the User model to interact with the user data in the database
const User = require("../models/User");

// Controller function to fetch the user's profile
exports.getProfile = async (req, res) => {
  try {
    // Find the user by their ID (coming from the authenticated request) and exclude the password field
    const user = await User.findById(req.user.id).select("-password");
    
    // Return the user's profile in the response with a success message
    res.status(200).json({ user, status: true, msg: "Profile found successfully.." });
  }
  catch (err) {
    // Log any errors that occur and return a 500 internal server error response
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}
