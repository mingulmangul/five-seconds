export const home = (req, res) => {
  return res.render("video/home", { pageTitle: "Home" });
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

export const upload = (req, res) => {
  return res.render("video/upload", { pageTitle: "Upload Video" });
};
