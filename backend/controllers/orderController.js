import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import redisClient from "../config/redis.js";
import { sendOrderEmail, sendShippingEmail } from "../utils/sendEmail.js";

// ✅ Create new order
export const createOrder = async (req, res) => {
  try {
    const { products, amount, address, paymentId, paymentStatus = "unpaid" } = req.body;

    // Check stock availability
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Product ${product?.name || 'Unknown'} is out of stock` });
      }
    }

    // Deduct stock and invalidate Redis cache
    for (let item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });

      // Invalidate individual product cache
      await redisClient.del(`product:${item.productId}`);
    }

    // Invalidate full product list cache
    await redisClient.del("products:all");

    // Create the order
    const newOrder = await Order.create({
      userId: req.user.id,
      products,
      amount,
      address,
      paymentId: paymentId || null,
      paymentStatus,
      status: paymentStatus === "paid" ? "processing" : "pending",
    });

    // Clear cart
    await Cart.findOneAndDelete({ userId: req.user.id });

    // Send confirmation email if paid
    const user = await User.findById(req.user.id);
    if (user?.email && paymentStatus === "paid") {
      await sendOrderEmail(user.email, newOrder._id, amount);
    }

    // Invalidate user's order cache
    await redisClient.del(`orders:${req.user.id}`);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get all orders (with Redis cache)
export const getOrders = async (req, res) => {
  try {
    const cacheKey = `orders:${req.user.id}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const orders = await Order.find({ userId: req.user.id }).populate("products.productId");

    // Cache the result for 5 minutes
    await redisClient.setEx(cacheKey, 300, JSON.stringify(orders));

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin updates order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    const user = await User.findById(order.userId);
    if (user?.email) {
      await sendShippingEmail(user.email, order._id, status);
    }

    // ❌ Invalidate user's Redis cache
    await redisClient.del(`orders:${order.userId}`);

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
