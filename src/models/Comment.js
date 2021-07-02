import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, maxLength: 200 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  createdAt: { type: Date, default: Date.now() },
  // Todo??? reply & likes
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
