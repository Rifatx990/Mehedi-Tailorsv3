const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getFilters,
  searchProducts
} = require('../controllers/product.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { productValidation, paginationValidation } = require('../middleware/validation.middleware');
const { uploadMultiple } = require('../middleware/upload.middleware');

// Public routes
router.get('/', validate(paginationValidation), getAllProducts);
router.get('/categories', getCategories);
router.get('/filters', getFilters);
router.get('/search', searchProducts);
router.get('/:id', getProduct);

// Protected admin routes
router.use(protect, restrictTo('admin'));
router.post(
  '/',
  uploadMultiple('images', 5),
  validate(productValidation),
  createProduct
);
router.put(
  '/:id',
  uploadMultiple('images', 5),
  validate(productValidation),
  updateProduct
);
router.delete('/:id', deleteProduct);

module.exports = router;
