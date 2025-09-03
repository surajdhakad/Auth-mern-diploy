const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../Middlewares/Auth");
const ensureAdmin = require("../Middlewares/adminAuth");
const ProductModel = require("../Models/Product");

// Add new product (Admin only)
router.post("/add-product", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    const newProduct = new ProductModel({ name, price, description, image });
    await newProduct.save();
    res.status(201).json({ success: true, message: "Product added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Update product
router.put("/update-product/:id", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product updated", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Delete product
router.delete("/delete-product/:id", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
