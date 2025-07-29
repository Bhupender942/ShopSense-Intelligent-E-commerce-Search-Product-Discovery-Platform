import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./db/connection";
import authRoutes from "./routes/authRoutes";

export async function createServer() {
  const app = express();

  // Connect to MongoDB
  await connectToDatabase();

  // Middleware
  app.use(
    cors({
      origin: [
        process.env.CLIENT_URL || "http://localhost:5173",
        "http://localhost:8080",
      ],
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET || "cookie-secret"));

  // API routes
  app.use("/api/auth", authRoutes);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  return app;
}
