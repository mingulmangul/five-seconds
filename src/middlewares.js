import multer from "multer";

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 100000000,
  },
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.loggedInUser || {};
  console.log(req.session);
  console.log(res.locals);
  next();
};
