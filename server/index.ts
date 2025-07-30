import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./db/connection";
import authRoutes from "./routes/authRoutes";
import autosuggestRoutes from "./routes/autosuggestRoutes";
import imageSearchRoutes from "./routes/imageSearchRoutes";
import { importProductData } from "./utils/importProducts";
import { preloadSuggestionCache } from "./utils/autosuggest";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Create __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function createServer() {
  const app = express();

  // Connect to MongoDB
  await connectToDatabase();
  await importProductData();

  // Preload autosuggest cache for better performance
  await preloadSuggestionCache();

  // Middleware - CORS configuration
  const isDevelopment = process.env.NODE_ENV !== "production";

  app.use(
    cors({
      origin: isDevelopment
        ? true // Allow all origins in development
        : [
            process.env.CLIENT_URL || "http://localhost:5173",
            "http://localhost:8080",
            "http://172.19.9.233:8080", // Network IP
            /^http:\/\/192\.168\.\d+\.\d+:8080$/, // Local network IPs
            /^http:\/\/172\.\d+\.\d+\.\d+:8080$/, // Docker/Network IPs
            /^http:\/\/10\.\d+\.\d+\.\d+:8080$/, // Private network IPs
          ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET || "cookie-secret"));

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/autosuggest", autosuggestRoutes);
  app.use("/api/image-search", imageSearchRoutes);

  // Serve static uploads for image search
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  return app;
}
