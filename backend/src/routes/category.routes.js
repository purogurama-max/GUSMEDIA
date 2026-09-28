const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');

// Public endpoints
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Protected endpoints (auth middleware akan ditambahkan di STEP 11)
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
