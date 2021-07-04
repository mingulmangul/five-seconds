import express from "express";
import { registerViews } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-z]{24})/views", registerViews);

export default apiRouter;
