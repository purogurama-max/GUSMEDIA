const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const { verifyToken } = require('../middleware/auth.middleware');

// Public endpoints
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

// Image upload endpoint
router.post('/upload', verifyToken, (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ success: false, message: 'No image data provided' });
  }
  
  // If base64, save to file or return data URL
  res.status(200).json({ success: true, url: image });
});

// Protected endpoints (Requires Admin Authentication)
router.post('/', verifyToken, createProduct);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;
