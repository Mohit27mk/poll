const pollService = require("../services/poll.service");

// Create Poll
const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "Invalid poll data" });
    }

    const poll = await pollService.createPoll(req.user.id, question, options);

    res.status(201).json({ success: true, data: poll });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// Get All Polls
const getAllPolls = async (req, res) => {
  try {
    const polls = await pollService.getAllPolls();
    res.status(200).json({ success: true, data: polls });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// Get Poll by ID
const getPollById = async (req, res) => {
  try {
    const poll = await pollService.getPollById(req.params.pollId);
    res.status(200).json({ success: true, data: poll });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// Vote in Poll
const votePoll = async (req, res) => {
  try {
    const { optionIndex } = req.body;

    if (optionIndex === undefined || optionIndex === null) {
      return res.status(400).json({ message: "Option index is required" });
    }

    const poll = await pollService.votePoll(req.params.pollId, req.user.id, optionIndex);

    // Real-time socket.io emit could go here if needed
    // io.emit("pollUpdated", poll._id);

    res.status(200).json({ success: true, data: poll });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPoll,
  getAllPolls,
  getPollById,
  votePoll,
};
