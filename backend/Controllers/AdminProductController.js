const ProductModel = require("../Models/Product");

// Add Product
const addProduct = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    const product = new ProductModel({ name, price, description, image });
    await product.save();
    return res.status(201).json({ message: "Product added", success: true, product });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Get All Products (Admin view)
const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    return res.status(200).json({ success: true, products });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found", success: false });
    return res.status(200).json({ message: "Product updated", success: true, product: updatedProduct });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found", success: false });
    return res.status(200).json({ message: "Product deleted", success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = { addProduct, getProducts, updateProduct, deleteProduct };
