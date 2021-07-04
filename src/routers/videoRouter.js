import express from "express";
import {
  edit,
  deleteVideo,
  getUpload,
  postUpload,
  watch,
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
videoRouter.get("/:id([0-9a-z]{24})/edit", privateOnly, edit);
videoRouter.get("/:id([0-9a-z]{24})/delete", privateOnly, deleteVideo);

export default videoRouter;
