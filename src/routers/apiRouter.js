import express from "express";
import {
  createComment,
  deleteComment,
  registerViews,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-z]{24})/views", registerViews);
apiRouter.post("/videos/:id([0-9a-z]{24})/comments", createComment);
apiRouter.post("/videos/:id([0-9a-z]{24})/comments/delete", deleteComment);

export default apiRouter;
