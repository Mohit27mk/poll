const express = require("express");
const router = express.Router();
const pollController = require("../controllers/poll.controller");
const authenticate = require("../middleware/authenticate");

// Poll Routes
router.post("/", authenticate, pollController.createPoll);
router.get("/", pollController.getAllPolls);
router.get("/:pollId", pollController.getPollById);
router.post("/:pollId/vote", authenticate, pollController.votePoll);

module.exports = router;
