import "dotenv/config";
import "regenerator-runtime";
import "./db";
import "./models/Comment";
import "./models/User";
import "./models/Video";
import app from "./server";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log("💚 Server is running 💚"));
