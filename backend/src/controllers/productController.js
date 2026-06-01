import mongoose from "mongoose";
import Product from "../models/Product.js";

const normalizeProductBody = (body) => {
  const images = Array.isArray(body.images)
    ? body.images
    : [body.image].filter(Boolean);

  const price = Number(body.price);
  const stock = Number(body.stock);

  return {
    title: body.title || body.name,
    price: Number.isFinite(price) ? price : 0,
    description: body.description || body.about || "",
    category: body.category || "",
    stock: Number.isFinite(stock) ? stock : 0,
    images,
    seller: body.seller || body.sellerId || undefined,
    sellerName: body.sellerName || "",
    rating: Number(body.rating || 0),
  };
};

// ✅ CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const body = normalizeProductBody(req.body);
    // enforce seller from authenticated user
    if (req.user) {
      body.seller = req.user._id;
      body.sellerName = req.user.businessName || req.user.name || "";
    }

    const product = new Product(body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const query = req.query.sellerId ? { seller: req.query.sellerId } : {};
    const products = await Product.find(query)
      .populate("seller")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // Only allow seller who owns the product to update
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (req.user && product.seller && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      normalizeProductBody(req.body),
      { returnDocument: "after", runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ GET SINGLE PRODUCT
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const product = await Product.findById(id).populate("seller");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // only owner seller or admin can delete
    if (req.user && product.seller && product.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ADD PRODUCT REVIEW
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (!name || !rating || !comment) {
      return res
        .status(400)
        .json({ message: "Name, rating and comment are required" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.reviews.push({
      name,
      rating: Number(rating),
      comment,
    });

    const reviewTotal = product.reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0
    );
    product.rating = Number((reviewTotal / product.reviews.length).toFixed(1));

    await product.save();
    const updated = await Product.findById(id).populate("seller");

    res.status(201).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
