import express from "express";
import { profile, userEdit, userDelete } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/:id([0-9a-z]{24})", profile);
userRouter.get("/:id([0-9a-z]{24})/edit", userEdit);
userRouter.get("/:id([0-9a-z]{24})/delete", userDelete);

export default userRouter;
