import express from "express";
import {
  addReview,
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  updateProduct
} from "../controllers/productController.js";
import { authenticate, requireApprovedSeller } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, requireApprovedSeller, createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.patch("/:id", authenticate, requireApprovedSeller, updateProduct);
router.delete("/:id", authenticate, requireApprovedSeller, deleteProduct);
router.post("/:id/reviews", authenticate, addReview);

export default router;
