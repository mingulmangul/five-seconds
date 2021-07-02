import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/fiveSecondsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.on("error", (error) => console.log("connection error:", error));
db.once("open", () => console.log("💚 DB is connected 💚"));
