// controllers/cartController.js
import Cart from "../models/Cart.js";
import redisClient from "../config/redis.js";

const getCartKey = (userId) => `cart:${userId}`;

// ✅ Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        products: [{ productId, quantity }],
      });
    } else {
      const index = cart.products.findIndex(p => p.productId.toString() === productId);
      if (index > -1) {
        cart.products[index].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
      await cart.save();
    }

    await redisClient.del(getCartKey(userId)); // Invalidate cache
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get cart items (Redis optimized)
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const redisKey = getCartKey(userId);

    const cachedCart = await redisClient.get(redisKey);
    if (cachedCart) return res.json(JSON.parse(cachedCart));

    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    await redisClient.set(redisKey, JSON.stringify(cart), { EX: 300 }); // 5 mins
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Remove specific product from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(p => p.productId.toString() !== productId);
    await cart.save();

    await redisClient.del(getCartKey(userId)); // Invalidate cache
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.findOneAndDelete({ userId });
    await redisClient.del(getCartKey(userId));
    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
