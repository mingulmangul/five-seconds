import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

const errorMsg = "Error: Please try again.";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate({ path: "owner", select: "name avatarUrl" });
  return res.render("video/home", { pageTitle: "Home", videos });
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  try {
    if (keyword) {
      videos = await Video.find({
        title: { $regex: new RegExp(keyword, "i") },
      })
        .sort({ createdAt: "desc" })
        .populate({ path: "owner", select: "name avatarUrl" });
    }
    return res.render("video/search", { pageTitle: "Search", videos });
  } catch (error) {
    req.flash("error", errorMsg);
    return res.status(400).redirect("/search");
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id)
      .populate({
        path: "owner",
        select: "avatarUrl name",
      })
      .populate({
        path: "comments",
        populate: {
          path: "owner",
          select: "name",
        },
      });
    if (!video) {
      req.flash("error", "Error: The video not found.");
      return res.status(404).redirect("/");
    }
    return res.render("video/watch", { pageTitle: video.title, video });
  } catch (error) {
    req.flash("error", errorMsg);
    return res.status(400).redirect("/");
  }
};

export const getVideoEdit = async (req, res) => {
  const {
    params: { id },
    session: { loggedInUser },
  } = req;
  try {
    const video = await Video.findById(id);
    if (!video) {
      req.flash("error", "Error: The video not found.");
      return res.status(404).redirect("/");
    }
    if (String(loggedInUser._id) !== String(video.owner)) {
      req.flash("error", "Error: Not authorized.");
      return res.status(403).redirect("/");
    }
    return res.render("video/edit-video", { pageTitle: "Edit Video", video });
  } catch (error) {
    req.flash("error", errorMsg);
    return res.status(400).redirect("/");
  }
};

export const postVideoEdit = async (req, res) => {
  const {
    file,
    body: { title, description, hashtags },
    params: { id },
    session: { loggedInUser },
  } = req;
  try {
    const video = await Video.findById(id);
    if (!video) {
      req.flash("error", "Error: The video not found.");
      return res.status(404).redirect("/");
    }
    if (String(loggedInUser._id) !== String(video.owner)) {
      req.flash("error", "Error: Not authorized.");
      return res.status(403).redirect("/");
    }
    await video.updateOne({
      thumbnailUrl: file ? file.path : video.thumbnailUrl,
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    req.flash("info", "Video updated!");
    return res.redirect(`/videos/${id}`);
  } catch (error) {
    req.flash("error", errorMsg);
    return res.status(400).redirect("/");
  }
};

export const deleteVideo = async (req, res) => {
  const {
    session: { loggedInUser },
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (!video) {
      req.flash("error", "Error: The video not found.");
      return res.status(404).redirect("/");
    }
    if (String(loggedInUser._id) !== String(video.owner)) {
      req.flash("error", "Error: Not authorized.");
      return res.status(403).redirect("/");
    }
    await video.deleteOne();
    req.flash("info", "Video is deleted!");
    return res.redirect("/");
  } catch (error) {
    req.flash("error", errorMsg);
    return res.status(400).redirect("/");
  }
};

export const getUpload = async (req, res) => {
  return res.render("video/upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    body: { title, description, hashtags },
    files: { videoFile, thumbnailFile },
    session: {
      loggedInUser: { _id },
    },
  } = req;
  try {
    const owner = await User.findById(_id);
    const video = await Video.create({
      fileUrl: videoFile[0].path,
      thumbnailUrl: thumbnailFile[0].path,
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      owner,
    });
    owner.videos.push(video._id);
    await owner.save();
    return res.redirect("/users/" + _id);
  } catch (error) {
    req.flash("error", errorMsg);
    return res.status(400).redirect("/videos/upload");
  }
};

export const registerViews = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    if (!video) {
      return res.sendStatus(404);
    }
    video.meta.views += 1;
    await video.save();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(400);
  }
};

export const createComment = async (req, res) => {
  const {
    body: { text },
    session: { loggedInUser },
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (!video) {
      req.flash("error", "Error: The video not found.");
      return res.status(404).redirect("/");
    }
    const comment = await Comment.create({
      text,
      owner: loggedInUser._id,
      video: id,
    });
    video.comments.push(comment._id);
    await video.save();
    req.flash("info", "Comment is added!");
    return res.status(201).json({ newCommentId: comment._id });
  } catch (error) {
    req.flash("error", errorMsg);
    return res.sendStatus(400);
  }
};

export const deleteComment = async (req, res) => {
  const {
    body: { commentId },
    session: { loggedInUser },
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (!video) {
      req.flash("error", "Error: The video not found.");
      return res.status(404).redirect("/");
    }
    const comment = await Comment.findById(commentId);
    if (String(loggedInUser._id) !== String(comment.owner)) {
      req.flash("error", "Error: Not authorized.");
      return res.status(403).redirect("/");
    }
    video.comments = video.comments.filter(
      (comment) => String(comment) !== String(commentId)
    );
    await video.save();
    await comment.deleteOne();
    req.flash("info", "Comment is deleted!");
    return res.sendStatus(201);
  } catch (error) {
    req.flash("error", errorMsg);
    return res.sendStatus(400);
  }
};
