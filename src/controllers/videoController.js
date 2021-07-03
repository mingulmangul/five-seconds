import Video from "../models/Video";
import User from "../models/User";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate({ path: "owner", select: "name avatarUrl" });
  return res.render("video/home", { pageTitle: "Home", videos });
};

export const search = (req, res) => {
  return res.render("video/search", { pageTitle: "Search" });
};

export const watch = (req, res) => {
  return res.render("video/watch"), { pageTitle: "video's title" };
};

export const edit = (req, res) => {
  return res.render("video/edit-video", { pageTitle: "Edit Video" });
};

export const deleteVideo = (req, res) => {
  return res.send("video delete");
};

export const getUpload = async (req, res) => {
  return res.render("video/upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    body: { title, description, hashtags },
    files: { videoFile, thumbnailFile },
    session: {
      user: { _id },
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
    console.log(error);
    req.flash("error", "Error: Please try again.");
    return res.redirect("/videos/upload");
  }
};
