const express = require('express');
const router = express.Router();
const {
  // Measurement endpoints
  createMeasurement,
  getMeasurements,
  getMeasurement,
  updateMeasurement,
  deleteMeasurement,
  
  // Wishlist endpoints
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { measurementValidation } = require('../middleware/validation.middleware');

// All routes are protected
router.use(protect);

// Measurement routes
router.post('/measurements', validate(measurementValidation), createMeasurement);
router.get('/measurements', getMeasurements);
router.get('/measurements/:id', getMeasurement);
router.put('/measurements/:id', validate(measurementValidation), updateMeasurement);
router.delete('/measurements/:id', deleteMeasurement);

// Wishlist routes
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:product_id', removeFromWishlist);

module.exports = router;
