
const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    poll: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
}, { timestamps: true });
module.exports = mongoose.model("Comment", commentSchema);