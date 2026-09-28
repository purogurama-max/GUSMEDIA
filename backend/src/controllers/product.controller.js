const ProductModel = require('../models/product.model');

// Helper: generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// GET /api/products — Get all products (with filter & pagination)
const getProducts = async (req, res, next) => {
  try {
    const { search, category_id, status, page = 1, limit } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offset = limitNum ? (pageNum - 1) * limitNum : undefined;

    const { rows, total } = await ProductModel.findAll({
      search,
      category_id,
      status,
      limit: limitNum,
      offset,
    });

    const response = {
      success: true,
      data: rows,
      meta: {
        total,
        page: pageNum,
        limit: limitNum || total,
        totalPages: limitNum ? Math.ceil(total / limitNum) : 1,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id — Get product by ID
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/slug/:slug — Get product by slug
const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await ProductModel.findBySlug(slug);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// POST /api/products — Create product
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category_id, image, status } = req.body;

    // Validation
    const errors = [];
    if (!name || name.trim() === '') errors.push('Product name is required');
    if (price === undefined || price === null) errors.push('Price is required');
    if (isNaN(Number(price)) || Number(price) < 0) errors.push('Price must be a valid non-negative number');

    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    const slug = generateSlug(name);

    // Check slug uniqueness
    const existing = await ProductModel.findBySlug(slug);
    if (existing) {
      return res.status(409).json({ success: false, message: 'A product with a similar name already exists' });
    }

    const product = await ProductModel.create({
      name: name.trim(),
      slug,
      description,
      price: Number(price),
      category_id,
      image,
      status,
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id — Update product
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, image, status } = req.body;

    // Check if product exists
    const existing = await ProductModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Validate price if provided
    if (price !== undefined && (isNaN(Number(price)) || Number(price) < 0)) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: ['Price must be a valid non-negative number'],
      });
    }

    // Re-generate slug if name changed
    let slug = undefined;
    if (name && name.trim() !== existing.name) {
      slug = generateSlug(name);
      const slugExists = await ProductModel.findBySlug(slug);
      if (slugExists && slugExists.id !== parseInt(id)) {
        return res.status(409).json({ success: false, message: 'A product with a similar name already exists' });
      }
    }

    const product = await ProductModel.update(id, {
      name: name ? name.trim() : undefined,
      slug,
      description,
      price: price !== undefined ? Number(price) : undefined,
      category_id,
      image,
      status,
    });

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id — Delete product
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await ProductModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await ProductModel.delete(id);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
