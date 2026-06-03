import User from "../models/User.js";
import Product from "../models/Product.js";

export const listSellers = async (req, res) => {
  try {
    const query = { role: "seller" };
    if (req.query.status) {
      query.sellerStatus = req.query.status;
    }

    const sellers = await User.find(query).sort({ createdAt: -1 });
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listPendingSellers = async (req, res) => {
  try {
    const pending = await User.find({
      role: "seller",
      sellerApproved: false,
      sellerStatus: { $ne: "rejected" },
    }).sort({ createdAt: -1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await User.findById(id);
    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.sellerApproved = true;
    seller.sellerStatus = "approved";
    seller.rejectionReason = null;
    seller.rejectedAt = null;
    await seller.save();

    res.json({ message: "Seller approved", user: seller });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const rejectSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const reason = req.body?.reason?.trim();

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const seller = await User.findById(id);
    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.sellerApproved = false;
    seller.sellerStatus = "rejected";
    seller.rejectionReason = reason;
    seller.rejectedAt = new Date();
    await seller.save();

    res.json({ message: "Seller rejected", user: seller });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listProducts = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) {
      query.approvalStatus = req.query.status;
    }

    const products = await Product.find(query)
      .populate("seller")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.approvalStatus = "approved";
    product.rejectionReason = null;
    product.approvedAt = new Date();
    product.rejectedAt = null;
    await product.save();

    const populated = await Product.findById(product._id).populate("seller");
    res.json({ message: "Product approved", product: populated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const reason = req.body?.reason?.trim();

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          approvalStatus: "rejected",
          rejectionReason: reason,
          approvedAt: null,
          rejectedAt: new Date()
        }
      },
      { returnDocument: "after" }
    ).populate("seller");

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product rejected", product: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export default {
  listSellers,
  listPendingSellers,
  approveSeller,
  rejectSeller,
  listProducts,
  approveProduct,
  rejectProduct,
};
