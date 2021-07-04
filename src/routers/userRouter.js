import express from "express";
import {
  profile,
  getUserEdit,
  postUserEdit,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  avatarUpload,
  nonSocialOnly,
  profileOwnerOnly,
  privateOnly,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/:id([0-9a-z]{24})", profile);
userRouter
  .route("/:id([0-9a-z]{24})/edit")
  .all(privateOnly, profileOwnerOnly)
  .get(getUserEdit)
  .post(avatarUpload.single("avatar"), postUserEdit);
userRouter
  .route("/:id([0-9a-z]{24})/change-password")
  .all(privateOnly, profileOwnerOnly, nonSocialOnly)
  .get(getChangePassword)
  .post(postChangePassword);

export default userRouter;
