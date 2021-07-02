import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  title: { type: String, required: true, maxLength: 100 },
  description: { type: String, maxLength: 1000 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now() },
  hashtags: [{ type: String, maxLength: 20 }],
  meta: {
    views: { type: Number, default: 0 },
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
