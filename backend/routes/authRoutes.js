import express from "express";
import { register, login, updateProfile, refreshToken } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken); // ✅ New Route for Refresh Token
router.put("/profile", protect, updateProfile);

export default router;
