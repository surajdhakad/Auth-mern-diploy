const express = require("express");
const router = express.Router();
const Cart = require("../Models/Cart");
const Product = require("../Models/Product");
const ensureAuthenticated = require("../Middlewares/Auth");

// Helper to calculate total items & price
const calculateTotals = (cart) => {
  const totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);
  const totalPrice = cart.products.reduce(
    (sum, p) => sum + p.quantity * (p.product.price || 0),
    0
  );
  return { totalItems, totalPrice };
};

// Add or Update Cart
router.post("/add", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) 
      return res.status(400).json({ success: false, message: "productId is required" });

    if (quantity <= 0)
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });

    const product = await Product.findById(productId);
    if (!product) 
      return res.status(404).json({ success: false, message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      const index = cart.products.findIndex(p => p.product.toString() === productId);
      if (index > -1) cart.products[index].quantity += quantity;
      else cart.products.push({ product: productId, quantity });
    } else {
      cart = new Cart({ user: userId, products: [{ product: productId, quantity }] });
    }

    await cart.save();
    const populatedCart = await Cart.findOne({ user: userId }).populate(
      "products.product",
      "name price image"
    );

    const totals = calculateTotals(populatedCart);

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: populatedCart,
      ...totals,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get User Cart
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId }).populate(
      "products.product",
      "name price image"
    );
    if (!cart) return res.status(200).json({ success: true, cart: { products: [] }, totalItems: 0, totalPrice: 0 });

    const totals = calculateTotals(cart);
    res.status(200).json({ success: true, cart, ...totals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update Product Quantity
router.put("/update", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || quantity <= 0) 
      return res.status(400).json({ success: false, message: "Valid productId and quantity required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const index = cart.products.findIndex(p => p.product.toString() === productId);
    if (index === -1) return res.status(404).json({ success: false, message: "Product not in cart" });

    cart.products[index].quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findOne({ user: userId }).populate(
      "products.product",
      "name price image"
    );
    const totals = calculateTotals(populatedCart);

    res.status(200).json({ success: true, message: "Cart updated", cart: populatedCart, ...totals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Remove Product from Cart
router.delete("/remove", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) return res.status(400).json({ success: false, message: "productId is required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();

    const populatedCart = await Cart.findOne({ user: userId }).populate(
      "products.product",
      "name price image"
    );
    const totals = calculateTotals(populatedCart);

    res.status(200).json({ success: true, message: "Product removed", cart: populatedCart, ...totals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Clear Cart
router.delete("/clear", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(200).json({ success: true, message: "Cart cleared", cart: { products: [] }, totalItems: 0, totalPrice: 0 });

    cart.products = [];
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared", cart, totalItems: 0, totalPrice: 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
