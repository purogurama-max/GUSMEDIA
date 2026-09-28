const CategoryModel = require('../models/category.model');

// Helper: generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// GET /api/categories — Get all categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.findAll();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

// GET /api/categories/:id — Get category by ID
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// POST /api/categories — Create category
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name || name.trim() === '') {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: ['Category name is required'],
      });
    }

    const slug = generateSlug(name);

    // Check unique slug
    const existing = await CategoryModel.findBySlug(slug);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Category with similar name already exists' });
    }

    const category = await CategoryModel.create({ name: name.trim(), slug, description });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// PUT /api/categories/:id — Update category
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existing = await CategoryModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    let slug = undefined;
    if (name && name.trim() !== existing.name) {
      slug = generateSlug(name);
      const slugExists = await CategoryModel.findBySlug(slug);
      if (slugExists && slugExists.id !== parseInt(id)) {
        return res.status(409).json({ success: false, message: 'Category with similar name already exists' });
      }
    }

    const category = await CategoryModel.update(id, {
      name: name ? name.trim() : undefined,
      slug,
      description,
    });

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/categories/:id — Delete category
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await CategoryModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await CategoryModel.delete(id);
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
