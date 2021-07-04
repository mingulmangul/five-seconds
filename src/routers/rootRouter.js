import express from "express";
import {
  getSignUp,
  postSignUp,
  getLogin,
  postLogin,
  logout,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import { privateOnly, publicOnly } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/signup").all(publicOnly).get(getSignUp).post(postSignUp);
rootRouter.route("/login").all(publicOnly).get(getLogin).post(postLogin);
rootRouter.get("/login/github/start", publicOnly, startGithubLogin);
rootRouter.get("/login/github/finish", publicOnly, finishGithubLogin);
rootRouter.get("/logout", privateOnly, logout);
rootRouter.get("/search", search);

export default rootRouter;
