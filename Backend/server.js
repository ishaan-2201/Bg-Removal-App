import express from "express";
import "dotenv/config";
import cors from "cors";
import connectToDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

//App config

const PORT = process.env.PORT || 4000;
const app = express();

connectToDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) =>
  res.send("Hello from backend, and also to vercel:)")
);

app.use("/api/user", userRouter);

app.use("/api/image", imageRouter);

app.listen(PORT, () => console.log("Server running on port " + PORT));
