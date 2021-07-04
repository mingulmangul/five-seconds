import express from "express";
import {
  deleteVideo,
  getUpload,
  postUpload,
  watch,
  getVideoEdit,
  postVideoEdit,
} from "../controllers/videoController";
import { privateOnly, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .all(privateOnly)
  .get(getUpload)
  .post(
    videoUpload.fields([{ name: "videoFile" }, { name: "thumbnailFile" }]),
    postUpload
  );
videoRouter.get("/:id([0-9a-z]{24})", watch);
videoRouter
  .route("/:id([0-9a-z]{24})/edit")
  .all(privateOnly)
  .get(getVideoEdit)
  .post(videoUpload.single("thumbnailFile"), postVideoEdit);
videoRouter.get("/:id([0-9a-z]{24})/delete", privateOnly, deleteVideo);

export default videoRouter;
