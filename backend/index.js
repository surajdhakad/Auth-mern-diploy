const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./Models/db"); // Database connection

// Routers
const AuthRouter = require("./Routes/AuthRouter");
const ProductRouter = require("./Routes/ProductRouter");
const CartRouter = require("./Routes/CartRouter");
const AdminRouter = require("./Routes/AdminRouter"); // Admin routes

const PORT = process.env.PORT || 8088;
const _dirname = path.resolve();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Health check route
app.get("/ping", (req, res) => {
  console.log("🔥 /ping route hit");
  res.status(200).send("PONG ✅ Server is running...");
});

// API Routes
app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRouter);
app.use("/api/cart", CartRouter);
app.use("/api/admin", AdminRouter);

// Error handling (only for API routes)
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "Route not found" });
  }
  next();
});

// ✅ Serve frontend (CRA uses build folder, not dist)
app.use(express.static(path.join(_dirname, "/frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "build", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
