import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addToCart, getCart, removeFromCart, clearCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:productId", protect, removeFromCart);
router.delete("/", protect, clearCart);

export default router;
