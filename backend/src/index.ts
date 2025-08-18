//backend/src/index.ts

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import authRouter from "./routes/auth";
import uploadRouter from "./routes/upload";
import transactionsRouter from "./routes/transactions";
import profileRouter from "./routes/profile";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middlewares
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Rotas
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/profile", profileRouter);

app.get("/", (req, res) => {
  res.send("Backend running with TypeScript!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
