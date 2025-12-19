import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth/auth.routes";
import jobRoutes from "./routes/Job/job.routes";
import applicationRoutes from "./routes/applications/application.route";
import connectDB from "./config/db";

dotenv.config();

const app = express();
connectDB();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/applications", applicationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
