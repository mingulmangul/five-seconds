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
videoRouter.get("/:id", watch);
videoRouter.get("/:id/edit", edit);
videoRouter.get("/:id/delete", deleteVideo);

export default videoRouter;
