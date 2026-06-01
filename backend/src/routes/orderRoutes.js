import express from "express";
import { authenticate } from "../middleware/auth.js";
import { createOrder, getOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", authenticate, createOrder);
router.get("/", authenticate, getOrders);

export default router;
