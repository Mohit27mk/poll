const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const userController = require("../controllers/user.controller");

// Get user profile (must be authenticated)
router.get("/profile", authenticate, userController.getProfile);

// Update user profile
router.put("/profile", authenticate, userController.updateProfile);

module.exports = router;
