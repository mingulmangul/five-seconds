import express from "express";
import morgan from "morgan";
import flash from "express-flash";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const logger = morgan("dev");

app.use(logger);

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));
// app.use(flash());

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
