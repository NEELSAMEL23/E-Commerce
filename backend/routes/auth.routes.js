import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  deleteUserById,
  updateUserProfile
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js"; // 


const router = express.Router();

// Public routes
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);

// Authenticated user
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, upload.single("avatar"), updateUserProfile); // ⬅️ user can update self
router.put("/users/:id", protect,  upload.single("avatar"), updateUserProfile);
router.delete("/users/:id", protect,  deleteUserById);


export default router;
