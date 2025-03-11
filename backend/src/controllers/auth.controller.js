const authService = require("../services/auth.service.js");

// Register Controller
const register = async (req, res) => {
  try {
    console.log("Register Controller");
    console.log(req.body);
    const result = await authService.registerUser(req.body);

    if (!result) {
      return res.status(400).json({ message: "Registration failed" });
    }

    res.status(201).json({
      message: "User registered successfully",
      user: result
    });
  } catch (error) {
    console.error("Register Controller Error:", error.message);
    res.status(error.status || 500).json({
      message: error.message || "Internal server error"
    });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);

    if (!result || !result.token) {
      return res.status(400).json({ message: "Login failed" });
    }

    res.status(200).json({
      message: "Login successful",
      token: result.token,
      user: result.user
    });
  } catch (error) {
    console.error("Login Controller Error:", error.message);
    res.status(error.status || 500).json({
      message: error.message || "Internal server error"
    });
  }
};




module.exports = {
  register,
  login
};
