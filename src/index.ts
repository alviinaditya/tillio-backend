import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CLIENT_URL, PORT } from "./config/env";
import connectDB from "./config/db";
import authRouter from "./presentation/routes/authRouter";
import errorMiddleware from "./presentation/middlewares/errorMiddleware";
import userRouter from "./presentation/routes/userRoutes";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Healthy");
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  await connectDB();
});
