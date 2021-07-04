import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const isHeroku = process.env.NODE_ENV === "production";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "five-seconds/videos",
  acl: "public-read",
});

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "five-seconds/images",
  acl: "public-read",
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
  storage: isHeroku ? s3VideoUploader : undefined,
});

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
  storage: isHeroku ? s3ImageUploader : undefined,
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.loggedInUser || {};
  res.locals.isHeroku = isHeroku;
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
