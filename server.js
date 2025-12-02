import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import userProgressRoutes from "./routes/userProgress.routes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import moduleContentRoutes from "./routes/moduleContent.routes.js";
import progressRoutes from "./routes/progressRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------
// CORS CONFIG
// ----------------------

// Replace with your computer's local network IP for LAN access
const NETWORK_IP = "192.168.1.5"; // <-- Change this to your actual LAN IP

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4173",
  "http://localhost:5173",
  `http://${NETWORK_IP}:4173`, // frontend running on another device in network
  "https://englishmate-frontend.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman) or allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ----------------------
// Middleware
// ----------------------
app.use(express.json());

// ----------------------
// ROUTES
// ----------------------
app.use("/api/module", moduleContentRoutes);
app.use("/api/progress", userProgressRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api", progressRoutes);

// ----------------------
// Test route
// ----------------------
app.get("/", (req, res) => res.send("Server is running successfully 🚀"));

// ----------------------
// 404 Handler
// ----------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ----------------------
// Global Error Handler
// ----------------------
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack || err);
  res.status(500).json({ msg: "Something went wrong", error: err.message });
});

// ----------------------
// Start server on all interfaces
// ----------------------
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}, accessible on LAN`)
);
