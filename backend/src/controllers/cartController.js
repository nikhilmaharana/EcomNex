import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const populateCart = (query) =>
  query.populate("items.product").then((cart) => cart || null);

const ensureCartOwner = (req, userId) => {
  if (!req.user) {
    throw { status: 401, message: "Authentication required" };
  }
  if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
    throw { status: 403, message: "Not authorized for this cart" };
  }
};

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    ensureCartOwner(req, userId);

    const cart = await populateCart(Cart.findOne({ user: userId }));
    res.json(cart || { user: userId, items: [] });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Could not fetch cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    ensureCartOwner(req, userId);
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid user or product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { user: userId } },
      { returnDocument: "after", upsert: true }
    );

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    const populated = await populateCart(Cart.findOne({ user: userId }));
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    ensureCartOwner(req, userId);
    const quantity = Number(req.body.quantity);

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((entry) => entry.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    item.quantity = quantity;
    await cart.save();

    const populated = await populateCart(Cart.findOne({ user: userId }));
    res.json(populated);
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message || "Could not update cart item" });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    ensureCartOwner(req, userId);
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    const populated = await populateCart(Cart.findOne({ user: userId }));
    res.json(populated);
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message || "Could not remove cart item" });
  }
};

export const clearCart = async (userId) => {
  await Cart.findOneAndUpdate({ user: userId }, { items: [] });
};
