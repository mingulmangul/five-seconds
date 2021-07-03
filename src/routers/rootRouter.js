import express from "express";
import {
  getSignUp,
  postSignUp,
  getLogin,
  postLogin,
  logout,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/signup").get(getSignUp).post(postSignUp);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/logout", logout);
rootRouter.get("/search", search);

export default rootRouter;
