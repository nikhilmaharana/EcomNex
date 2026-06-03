import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { webcrypto } from "crypto";

dotenv.config();

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

const app = express();
// Allow Authorization header in CORS so browser can send Bearer token
app.use(
  cors({
    origin: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// routes
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "degraded",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

const PORT = process.env.PORT || 5000;
const RETRY_DB_CONNECTION_IN_MS = 10000;

const connectDatabase = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing in backend/.env");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.error(
      "Backend is still running. Add your current IP in MongoDB Atlas Network Access, then the app will retry."
    );

    setTimeout(connectDatabase, RETRY_DB_CONNECTION_IN_MS);
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDatabase();
});
