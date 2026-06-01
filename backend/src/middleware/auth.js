import User from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) return res.status(401).json({ message: "Missing auth token" });

    const payload = verifyToken(token);
    if (!payload || !payload.id) return res.status(401).json({ message: "Invalid token" });

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("[auth] Authentication error:", err?.message || err);
    res.status(401).json({ message: "Authentication failed" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export const requireApprovedSeller = (req, res, next) => {
  if (!req.user || req.user.role !== "seller") {
    return res.status(403).json({ message: "Seller access required" });
  }
  if (!req.user.sellerApproved) {
    return res.status(403).json({ message: "Seller awaiting admin approval" });
  }
  next();
};

export default { authenticate, requireAdmin, requireApprovedSeller };
