import multer from "multer";

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
});

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.loggedInUser || {};
  // console.log(req.session);
  // console.log(res.locals);
  next();
};

export const publicOnly = (req, res, next) => {
  if (req.session.loggedIn) {
    req.flash("error", "You are aleardy logged in.");
    return res.redirect("/");
  }
  return next();
};

export const privateOnly = (req, res, next) => {
  if (!req.session.loggedIn) {
    req.flash("error", "Login first.");
    return res.redirect("/login");
  }
  return next();
};

export const profileOwnerOnly = (req, res, next) => {
  const {
    session: { loggedInUser },
    params: { id },
  } = req;
  if (String(loggedInUser._id) !== String(id)) {
    req.flash("error", "Error: Not authorized.");
    return res.redirect("/");
  }
  return next();
};

export const nonSocialOnly = (req, res, next) => {
  const { socialLogin } = req.session.loggedInUser;
  if (socialLogin) {
    req.flash("error", "Error: Not authorized.");
    return res.redirect("/");
  }
  return next();
};
