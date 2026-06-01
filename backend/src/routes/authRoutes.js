import express from "express";
import { getUsers, login, signup, updateUser } from "../controllers/authController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", authenticate, requireAdmin, getUsers);
router.patch("/users/:id", authenticate, updateUser);

export default router;
