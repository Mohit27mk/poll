const userService = require("../services/user.service");

// Get profile controller
const getProfile = async (req, res) => {
  try {
    const result = await userService.getUserProfile(req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// Update profile controller
const updateProfile = async (req, res) => {
  try {
    const updateData = req.body; // validate fields as needed
    const result = await userService.updateUserProfile(req.user.id, updateData);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
