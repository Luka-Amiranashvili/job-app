process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth/auth.routes";
import jobRoutes from "./routes/Job/job.routes";
import applicationRoutes from "./routes/applications/application.route";
import connectDB from "./config/db";
import helmet from "helmet";
import hpp from "hpp";

dotenv.config();

const app = express();
connectDB();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(hpp());
app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/applications", applicationRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      message: "Something went wrong!",
      error: process.env.NODE_ENV === "production" ? {} : err.message,
    });
  }
);

process.on("unhandledRejection", (err: any) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
