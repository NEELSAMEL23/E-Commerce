import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized, token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Explicitly attach user details including role
    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(401).json({ message: "Token invalid" });
  }
};


