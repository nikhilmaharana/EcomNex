import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: String,
    price: Number,
    quantity: Number,
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    address: {
      name: String,
      phone: String,
      city: String,
      state: String,
      pincode: String,
      address: String,
    },
    paymentMethod: String,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "pay_on_delivery"],
      default: "pending",
    },
    upiId: String,
    subtotal: Number,
    deliveryFee: { type: Number, default: 99 },
    total: Number,
    status: {
      type: String,
      enum: ["placed", "packed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
