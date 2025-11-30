// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import userProgressRoutes from "./routes/userProgress.routes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import moduleContentRoutes from "./routes/moduleContent.routes.js";
import progressRoutes from "./routes/progressRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "https://englishmate-frontend.onrender.com", // your frontend URL
    credentials: true, // allow cookies
  })
);
app.use(express.json()); // parse JSON bodies
app.use(cookieParser()); // parse cookies

// Routes
app.use("/api/module", moduleContentRoutes);
app.use("/api/progress", userProgressRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api", progressRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  res.status(500).json({ msg: "Something went wrong" });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
