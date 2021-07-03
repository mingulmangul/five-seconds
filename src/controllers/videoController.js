import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate({ path: "owner", select: "name avatarUrl" });
  // console.log(videos);
  return res.render("video/home", { pageTitle: "Home", videos });
};

export const search = (req, res) => {
  return res.render("video/search", { pageTitle: "Search" });
};

export const play = (req, res) => {
  return res.render("video/play"), { pageTitle: "video's title" };
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
  } = req;

  try {
    // Todo: add owner path
    await Video.create({
      fileUrl: videoFile[0].path,
      thumbnailUrl: thumbnailFile[0].path,
      title,
      description,
      hashtags,
    });
    return res.redirect("/"); // Todo: redirect to /user/:id
  } catch {
    req.flash("error", "Error: Please try again.");
    return res.redirect("/videos/upload");
  }
};
