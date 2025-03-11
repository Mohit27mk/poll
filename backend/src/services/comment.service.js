const Comment = require("../models/comment.model.js");

const addComment = async (pollId, userId, text, parentComment = null) => {
  try {
    if (!text) {
      throw { status: 400, message: "Comment text is required" };
    }

    const comment = new Comment({
      poll: pollId,
      user: userId,
      text,
      parentComment: parentComment || null,
    });

    await comment.save();
    await comment.populate('user', 'username profilePicture');
    io.to(pollId).emit('newComment', comment);
    return comment;
  } catch (error) {
    console.error("Add Comment Error:", error.message);
    throw error;
  }
};

const getCommentsByPoll = async (pollId) => {
  try {
    const comments = await Comment.find({ poll: pollId })
      .populate("user", "username profilePicture")
      .populate("parentComment")
      .sort({ createdAt: -1 });

    return comments;
  } catch (error) {
    console.error("Get Comments Error:", error.message);
    throw error;
  }
};

module.exports = {
  addComment,
  getCommentsByPoll,
};
