import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { sendOrderEmail } from "../utils/sendEmail.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Renamed to avoid conflict with orderController.js
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Verify Razorpay Payment, Update Order & Reduce Stock
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    const order = await Order.findById(orderId).populate("products.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "paid";
    order.paymentId = razorpay_payment_id;
    order.status = "processing";
    await order.save();

    for (const item of order.products) {
      if (item.productId) {
        const product = await Product.findById(item.productId._id);
        if (product && product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
        }
      }
    }

    const user = await User.findById(order.userId);
    if (user && user.email) {
      await sendOrderEmail(user.email, order._id, order.amount);
    }

    res.json({ success: true, message: "Payment verified, order updated, stock reduced" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
