import express from "express";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cartController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/:userId", authenticate, getCart);
router.post("/:userId/items", authenticate, addToCart);
router.patch("/:userId/items/:productId", authenticate, updateCartItem);
router.delete("/:userId/items/:productId", authenticate, removeCartItem);

export default router;
