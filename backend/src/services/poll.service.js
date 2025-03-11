const Poll = require("../models/poll.model.js");
const Vote = require("../models/vote.model.js");

const createPoll = async (userId, question, options) => {
  try {
    const poll = new Poll({
      question,
      options: options.map((opt) => ({ text: opt })),
      createdBy: userId,
    });

    await poll.save();
    return poll;
  } catch (error) {
    console.error("Create Poll Error:", error.message);
    throw error;
  }
};

const getAllPolls = async () => {
  try {
    const polls = await Poll.find()
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    return polls;
  } catch (error) {
    console.error("Get All Polls Error:", error.message);
    throw error;
  }
};

const getPollById = async (pollId) => {
  try {
    const poll = await Poll.findById(pollId)
      .populate("createdBy", "username");

    if (!poll) {
      throw { status: 404, message: "Poll not found" };
    }

    return poll;
  } catch (error) {
    console.error("Get Poll By ID Error:", error.message);
    throw error;
  }
};

const votePoll = async (pollId, userId, optionIndex) => {
  try {
    const poll = await Poll.findById(pollId);

    if (!poll) {
      throw { status: 404, message: "Poll not found" };
    }
   
    if (poll.voters?.includes(userId)) {
      throw { status: 400, message: "You have already voted in this poll" };
    }

    // if (optionIndex < 0 || optionIndex >= poll.options.length) {
    //   throw { status: 400, message: "Invalid option selected" };
    // }
    const option = poll.options.find(opt => opt._id.toString() === optionIndex);

    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }
    
    // Increment the votes
    option.votes += 1;
    
    poll.voters.push(userId);

    await poll.save();

    // Save to Vote collection for tracking
    const vote = new Vote({
      poll: pollId,
      user: userId,
      optionId:optionIndex,
    });

    await vote.save();
    io.to(pollId).emit('voteUpdate', poll);

    return poll;
  } catch (error) {
    console.error("Vote Poll Error:", error.message);
    throw error;
  }
};

module.exports = {
  createPoll,
  getAllPolls,
  getPollById,
  votePoll,
};
