import express from "express";
import {
  approveProduct,
  approveSeller,
  listPendingSellers,
  listProducts,
  listSellers,
  rejectProduct,
  rejectSeller,
} from "../controllers/adminController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get("/sellers", listSellers);
router.get("/sellers/pending", listPendingSellers);
router.patch("/sellers/:id/approve", approveSeller);
router.patch("/sellers/:id/reject", rejectSeller);
router.get("/products", listProducts);
router.patch("/products/:id/approve", approveProduct);
router.patch("/products/:id/reject", rejectProduct);

export default router;
