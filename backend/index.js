const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
require("./Models/db"); // Database connection

// Routers
const AuthRouter = require("./Routes/AuthRouter");
const ProductRouter = require("./Routes/ProductRouter");
const CartRouter = require("./Routes/CartRouter");
const AdminRouter = require("./Routes/AdminRouter"); // Admin routes

const PORT = process.env.PORT || 8088;

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
app.use("/api/auth", AuthRouter);       // Signup/Login
app.use("/api/products", ProductRouter); // Public product routes
app.use("/api/cart", CartRouter);       // User cart routes
app.use("/api/admin", AdminRouter);     // Admin only routes

// Error handling (404)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
