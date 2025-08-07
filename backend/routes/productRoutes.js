import express from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ Only admin can add products with image upload
router.post("/", protect, adminOnly, upload.single("image"), createProduct);

// ✅ Anyone can fetch products
router.get("/", getProducts);
router.get("/:id", getProductById);

// ✅ Only admin can update or delete products
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
