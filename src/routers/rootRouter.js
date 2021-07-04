import express from "express";
import {
  getSignUp,
  postSignUp,
  getLogin,
  postLogin,
  logout,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import { privateOnly, publicOnly } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/signup").all(publicOnly).get(getSignUp).post(postSignUp);
rootRouter.route("/login").all(publicOnly).get(getLogin).post(postLogin);
rootRouter.get("/logout", privateOnly, logout);
rootRouter.get("/search", search);

export default rootRouter;
