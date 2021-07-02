import multer from "multer";

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 100000000,
  },
});
