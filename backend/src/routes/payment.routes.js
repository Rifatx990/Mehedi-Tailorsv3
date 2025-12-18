const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  verifyPayment,
  getPaymentMethods
} = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

// Protected routes
router.use(protect);

router.get('/methods', getPaymentMethods);
router.post('/initiate', initiatePayment);
router.get('/verify/:payment_id', verifyPayment);

module.exports = router;
