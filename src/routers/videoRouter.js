import express from "express";
import {
  edit,
  deleteVideo,
  getUpload,
  postUpload,
  watch,
} from "../controllers/videoController";
import { videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .get(getUpload)
  .post(
    videoUpload.fields([{ name: "videoFile" }, { name: "thumbnailFile" }]),
    postUpload
  );
videoRouter.get("/:id([0-9a-z]{24})", watch);
videoRouter.get("/:id([0-9a-z]{24})/edit", edit);
videoRouter.get("/:id([0-9a-z]{24})/delete", deleteVideo);

export default videoRouter;
