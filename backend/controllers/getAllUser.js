const User = require("../models/user");

// Controller to get all users
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({}, "-password"); // Exclude passwords from the result

    res.status(200).json({ message: "List retrieved successfully", users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers };
