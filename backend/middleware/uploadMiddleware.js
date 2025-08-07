// middleware/uploadMiddleware.js
import multer from "multer";

// ✅ Store file in memory (buffer) for Cloudinary upload
const storage = multer.memoryStorage();

// ✅ File filter to allow only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

// ✅ File size limit (5MB max)
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
