import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  stock: { type: Number, default: 0 },
  images: [String],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  sellerName: String,
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rejectionReason: { type: String, default: null },
  approvedAt: { type: Date, default: null },
  rejectedAt: { type: Date, default: null },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      name: String,
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
