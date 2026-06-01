import express from "express";
import { listPendingSellers, approveSeller, rejectSeller } from "../controllers/adminController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get("/sellers/pending", listPendingSellers);
router.patch("/sellers/:id/approve", approveSeller);
router.delete("/sellers/:id/reject", rejectSeller);

export default router;
