import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { clearCart } from "./cartController.js";

const DELIVERY_FEE = 99;

const buildOrderItems = async (items) => {
  const productIds = items.map((item) => item.productId || item.product);
  const products = await Product.find({ _id: { $in: productIds } });

  return items.map((item) => {
    const productId = String(item.productId || item.product);
    const product = products.find((entry) => entry._id.toString() === productId);
    if (!product) throw new Error("One or more products were not found");
    const quantity = Number(item.quantity || 1);

    if (Number(product.stock || 0) < quantity) {
      throw new Error(`${product.title} has only ${product.stock || 0} item(s) in stock`);
    }

    return {
      product: product._id,
      title: product.title,
      price: product.price,
      quantity,
      seller: product.seller || undefined,
    };
  });
};

export const createOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (req.user.role !== "buyer" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only buyers can create orders" });
    }

    const {
      items,
      address,
      paymentMethod = "cod",
      paymentStatus,
      upiId,
      fromCart = false,
    } = req.body;

    const buyerId = req.user.role === "admin" && req.body.buyerId ? req.body.buyerId : req.user._id;

    if (!mongoose.Types.ObjectId.isValid(buyerId)) {
      return res.status(400).json({ message: "Invalid buyer ID" });
    }

    let orderItems = items;
    if (fromCart) {
      const cart = await Cart.findOne({ user: buyerId });
      orderItems = cart?.items || [];
    }

    if (!orderItems?.length) {
      return res.status(400).json({ message: "Order needs at least one product" });
    }

    const normalizedItems = await buildOrderItems(orderItems);
    const invalidStockItem = normalizedItems.find((item) => item.quantity < 1);
    if (invalidStockItem) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const subtotal = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      buyer: buyerId,
      items: normalizedItems,
      address,
      paymentMethod,
      paymentStatus:
        paymentStatus || (paymentMethod === "cod" ? "pay_on_delivery" : "paid"),
      upiId: paymentMethod === "cod" ? "" : upiId || "",
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total: subtotal + DELIVERY_FEE,
    });

    await Promise.all(
      normalizedItems.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        })
      )
    );

    if (fromCart) {
      await clearCart(buyerId);
    }

    const populated = await Order.findById(order._id)
      .populate("items.product")
      .populate("items.seller")
      .populate("buyer");

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { buyerId, sellerId } = req.query;
    const query = {};

    if (req.user.role === "buyer") {
      query.buyer = req.user._id;
    } else if (req.user.role === "seller") {
      const resolvedSellerId = sellerId || req.user._id;
      if (sellerId && sellerId !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to view these seller orders" });
      }
      query["items.seller"] = resolvedSellerId;
    } else if (buyerId) {
      query.buyer = buyerId;
    }

    if (req.user.role === "admin" && sellerId) {
      query["items.seller"] = sellerId;
    }

    const orders = await Order.find(query)
      .populate("items.product")
      .populate("items.seller")
      .populate("buyer")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
