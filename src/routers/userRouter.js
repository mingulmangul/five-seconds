import express from "express";
import {
  profile,
  getUserEdit,
  postUserEdit,
  userDelete,
} from "../controllers/userController";
import { avatarUpload } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/:id([0-9a-z]{24})", profile);
userRouter
  .route("/:id([0-9a-z]{24})/edit")
  .get(getUserEdit)
  .post(avatarUpload.single("avatar"), postUserEdit);
userRouter.get("/:id([0-9a-z]{24})/delete", userDelete);

export default userRouter;
