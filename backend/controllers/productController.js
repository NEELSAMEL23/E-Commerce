// controllers/productController.js
import Product from "../models/Product.js";
import redisClient from "../config/redis.js";

const getAllProductsKey = "products:all";
const getProductByIdKey = (id) => `product:${id}`;

// ✅ Create product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file?.path;

    const product = await Product.create({
      name,
      price,
      description,
      image,
    });

    await redisClient.del(getAllProductsKey); // Invalidate all products cache
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all products (cached)
export const getProducts = async (req, res) => {
  try {
    const cached = await redisClient.get(getAllProductsKey);
    if (cached) return res.json(JSON.parse(cached));

    const products = await Product.find();
    await redisClient.set(getAllProductsKey, JSON.stringify(products), { EX: 300 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get product by ID (cached)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const redisKey = getProductByIdKey(id);

    const cached = await redisClient.get(redisKey);
    if (cached) return res.json(JSON.parse(cached));

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await redisClient.set(redisKey, JSON.stringify(product), { EX: 300 });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const image = req.file?.path;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    if (image) product.image = image;

    await product.save();

    await redisClient.del(getAllProductsKey);
    await redisClient.del(getProductByIdKey(id));
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    await redisClient.del(getAllProductsKey);
    await redisClient.del(getProductByIdKey(id));
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
