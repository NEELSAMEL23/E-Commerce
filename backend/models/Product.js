import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String,
  stock: { type: Number, default: 1 },

  // ✅ Category reference (foreign key)
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }

}, { timestamps: true });

export default mongoose.model("Product", productSchema);
