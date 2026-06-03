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
    approvalStatus: body.approvalStatus || "pending",
    rejectionReason: body.rejectionReason || null,
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
    body.approvalStatus = "pending";
    body.rejectionReason = null;
    body.approvedAt = null;
    body.rejectedAt = null;

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
    let query = {};
    if (req.query.sellerId) {
      const sellerMatches = [req.query.sellerId];
      if (mongoose.Types.ObjectId.isValid(req.query.sellerId)) {
        sellerMatches.push(new mongoose.Types.ObjectId(req.query.sellerId));
      }
      query = { seller: { $in: sellerMatches } };
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .lean();

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

    const updates = normalizeProductBody(req.body);
    updates.approvalStatus = "pending";
    updates.rejectionReason = null;
    updates.approvedAt = null;
    updates.rejectedAt = null;

    const updated = await Product.findByIdAndUpdate(
      id,
      updates,
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

    const product = await Product.findById(id).lean();
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
