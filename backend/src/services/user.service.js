const User = require("../models/user.model.js");

// Get a user's profile by ID
const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId)
      .select("username email profilePicture createdPolls votedPolls");

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    return user;
  } catch (error) {
    console.error("Get Profile Error:", error.message);
    throw error;
  }
};

// Update a user's profile (optional fields: username, email, profilePicture)
const updateUserProfile = async (userId, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("username email profilePicture");

    if (!updatedUser) {
      throw { status: 404, message: "User not found" };
    }

    return updatedUser;
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    throw error;
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
