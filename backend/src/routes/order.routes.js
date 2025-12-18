const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  cancelOrder,
  downloadInvoice,
  addPayment,
  getOrderStats,
  applyCoupon
} = require('../controllers/order.controller');
const { protect, isOwner } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { orderValidation } = require('../middleware/validation.middleware');

// All routes are protected
router.use(protect);

// Order routes
router.post('/', validate(orderValidation), createOrder);
router.get('/', getOrders);
router.get('/stats', getOrderStats);
router.post('/coupon', applyCoupon);

// Specific order routes
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.get('/:id/invoice', downloadInvoice);
router.post('/:id/payment', addPayment);

module.exports = router;
