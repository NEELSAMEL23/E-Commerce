import express from "express";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ User must be logged in to create an order or verify payment
router.post("/razorpay-order", protect, createPaymentOrder);
router.post("/verify-payment", protect, verifyPayment);

export default router;
