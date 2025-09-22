// server.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// Create HTTP server
const server = http.createServer(app);

// WebSocket server setup
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");
  ws.send("Hello from WebSocket server 👋");
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
