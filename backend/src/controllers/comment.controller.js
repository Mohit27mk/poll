const commentService = require("../services/comment.service");

// Add a comment to a poll
const addComment = async (req, res) => {
  try {
    const { text, parentComment } = req.body;
    const pollId = req.params.pollId;

    if (!text) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const comment = await commentService.addComment(pollId, req.user.id, text, parentComment);

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// Get all comments for a poll
const getCommentsByPoll = async (req, res) => {
  try {
    const pollId = req.params.pollId;

    const comments = await commentService.getCommentsByPoll(pollId);

    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addComment,
  getCommentsByPoll,
};
