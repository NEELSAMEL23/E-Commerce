import Category from "../models/Category.js";

// ✅ Create a new category
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;


        const category = await Category.create({ name, description, });
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Get a single category by ID
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Update category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
       

        const category = await Category.findById(id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        category.name = name || category.name;
        category.description = description || category.description;
      

        await category.save();
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Delete category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);

        if (!category) return res.status(404).json({ message: "Category not found" });

        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
