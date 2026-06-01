import User from "../models/User.js";

export const listPendingSellers = async (req, res) => {
  try {
    const pending = await User.find({ role: "seller", sellerApproved: false }).sort({ createdAt: -1 });
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
    await seller.save();

    res.json({ message: "Seller approved", user: seller });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const rejectSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await User.findById(id);
    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }

    await seller.deleteOne();
    res.json({ message: "Seller rejected and removed" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export default { listPendingSellers, approveSeller, rejectSeller };
