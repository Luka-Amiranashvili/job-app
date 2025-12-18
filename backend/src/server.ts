import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth/auth.routes";
import connectDB from "./config/db";

dotenv.config();

const app = express();
connectDB();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.post("/test-me", (req, res) => {
  res.json({ message: "Post requresd reached", body: req.body });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
