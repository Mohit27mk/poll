const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ text: String, votes: { type: Number, default: 0 } }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });
module.exports = mongoose.model("Poll", pollSchema);