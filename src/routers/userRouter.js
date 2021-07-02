import express from "express";
import { profile, userEdit, userDelete } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/:id", profile);
userRouter.get("/:id/edit", userEdit);
userRouter.get("/:id/delete", userDelete);

export default userRouter;
