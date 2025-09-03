const Cart = require("../Models/Cart");

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, products: [] });

    const index = cart.products.findIndex((p) => p.product.toString() === productId);
    if (index > -1) {
      cart.products[index].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    const populatedCart = await Cart.findOne({ user: userId }).populate("products.product");

    res.status(200).json({ success: true, message: "Product added to cart", cart: populatedCart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get user cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("products.product");
    if (!cart) return res.status(200).json({ success: true, cart: { products: [] } });

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) return res.status(400).json({ success: false, message: "productId is required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.products = cart.products.filter((p) => p.product.toString() !== productId);
    await cart.save();

    const populatedCart = await Cart.findOne({ user: userId }).populate("products.product");

    res.status(200).json({ success: true, message: "Product removed from cart", cart: populatedCart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update product quantity
exports.updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Valid productId and quantity required" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const index = cart.products.findIndex((p) => p.product.toString() === productId);
    if (index === -1) return res.status(404).json({ success: false, message: "Product not in cart" });

    cart.products[index].quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findOne({ user: userId }).populate("products.product");

    res.status(200).json({ success: true, message: "Cart updated", cart: populatedCart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(200).json({ success: true, message: "Cart cleared", cart: { products: [] } });

    cart.products = [];
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
