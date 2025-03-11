const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const appConfig = require("../config/app.config");


const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1]; 

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });  
    }
    const decoded = jwt.verify(token, appConfig.JWT_SECRET);
    

    // Find user in DB (optional but recommended for verifying user existence)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request object
    req.user = { id: user._id, username: user.username };

    next(); // Proceed to next middleware/controller
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Authentication failed", error: error.message });
  }
};

module.exports = authenticate;