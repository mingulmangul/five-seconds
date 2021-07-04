import express from "express";
import {
  profile,
  getUserEdit,
  postUserEdit,
  userDelete,
} from "../controllers/userController";
import { avatarUpload, privateOnly } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/:id([0-9a-z]{24})", profile);
userRouter
  .route("/:id([0-9a-z]{24})/edit")
  .all(privateOnly)
  .get(getUserEdit)
  .post(avatarUpload.single("avatar"), postUserEdit);
userRouter.get("/:id([0-9a-z]{24})/delete", privateOnly, userDelete);

export default userRouter;
