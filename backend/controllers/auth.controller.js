import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";
import bcrypt from "bcryptjs";

// ✅ Helper: Build avatar URL (Cloudinary or Local)
const buildAvatarUrl = (req, avatar) => {
  if (!avatar) return null;
  return avatar.startsWith("http")
    ? avatar
    : `${req.protocol}://${req.get("host")}/${avatar}`;
};

// ✅ REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name = "", email = "", password = "" } = req.body; 
    const file = req.file;

    // Basic validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.trim() });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    let avatarUrl = "";

    // ✅ Upload avatar to Cloudinary if provided
    if (file) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
        avatarUrl = result?.secure_url || "";
      } catch (uploadErr) {
        console.warn("Cloudinary upload failed, using local file path.");
        avatarUrl = `uploads/${file.filename}`;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with forced role = "user"
    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      avatar: avatarUrl,
      role: "user", // ✅ Force default role
    });

    // Respond with user data
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: buildAvatarUrl(req, user.avatar),
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Password did not match" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: buildAvatarUrl(req, user.avatar),
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: buildAvatarUrl(req, user.avatar),
      role: user.role,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ UPDATE PROFILE (Self or Admin)
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    const { name, email, role } = req.body;
    const file = req.file;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent non-admins from editing others
    if (req.user.role !== "admin" && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Only admin can change role
    if (role && req.user.role === "admin") {
      user.role = role;
    }

    user.name = name || user.name;
    user.email = email || user.email;

    // ✅ Update avatar
    if (file) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
        user.avatar = result.secure_url;
      } catch (err) {
        console.warn("Cloudinary upload failed, using local file path.");
        user.avatar = `uploads/${file.filename}`;
      }
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: buildAvatarUrl(req, updatedUser.avatar),
      role: updatedUser.role,
    });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE USER (Admin)
export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete another admin" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: err.message });
  }
};
