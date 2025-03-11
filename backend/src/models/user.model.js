const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    createdPolls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }],
    votedPolls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }],
}, { timestamps: true });
module.exports = mongoose.model("User", userSchema);