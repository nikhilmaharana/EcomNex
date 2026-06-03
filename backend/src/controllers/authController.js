import User from "../models/User.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

const cleanEmail = (email = "") => email.trim().toLowerCase();

export const signup = async (req, res) => {
  try {
    const {
      name,
      businessName,
      email,
      phone,
      gst,
      password,
      role = "buyer",
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!["buyer", "seller"].includes(role)) {
      return res.status(400).json({ message: "Invalid account role" });
    }

    if (role === "buyer" && !name) {
      return res.status(400).json({ message: "Full name is required" });
    }

    if (role === "seller" && (!businessName || !phone || !gst)) {
      return res
        .status(400)
        .json({ message: "Business name, phone and GST are required" });
    }

    const existingUser = await User.findOne({ email: cleanEmail(email) });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      businessName,
      email: cleanEmail(email),
      phone,
      gst,
      role,
      password: hashPassword(password),
    });

    // New sellers must be approved by admin
    if (role === "seller") {
      user.sellerApproved = false;
      user.sellerStatus = "pending";
      await user.save();
    }

    const token = signToken({ id: user._id, role: user.role });

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: cleanEmail(email) });
    if (!user || (role && user.role !== role)) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Prevent rejected sellers from logging in
    if (user.role === "seller" && user.sellerStatus === "rejected") {
      return res.status(403).json({
        message:
          "Your seller account was rejected. Reason: " +
          (user.rejectionReason || "Not specified"),
      });
    }

    // Prevent seller access until approved
    if (user.role === "seller" && !user.sellerApproved) {
      return res.status(403).json({ message: "Seller awaiting admin approval" });
    }

    const token = signToken({ id: user._id, role: user.role });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "businessName",
      "email",
      "phone",
      "location",
      "address",
      "image",
    ];

    const updates = allowedFields.reduce((acc, field) => {
      if (req.body[field] !== undefined) acc[field] = req.body[field];
      return acc;
    }, {});

    if (updates.email) {
      updates.email = cleanEmail(updates.email);
      const existingUser = await User.findOne({
        email: updates.email,
        _id: { $ne: req.params.id },
      });

      if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    // only admin or owner can update
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Not authorized to update this user" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
