const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const authenticate = require("../middleware/authenticate");

// Comment Routes
router.post("/:pollId", authenticate, commentController.addComment);
router.get("/:pollId", commentController.getCommentsByPoll);

module.exports = router;
