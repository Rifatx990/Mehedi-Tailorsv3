const { Order } = require('../models');
const { generateInvoice } = require('../utils/invoiceGenerator');

exports.createOrder = async (req, res, next) => {
  try {
    const orderData = {
      user_id: req.user.id,
      ...req.body
    };

    const order = await Order.create(orderData);

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const filters = req.query;
    
    const orders = await Order.findByUser(req.user.id, filters);

    res.json({
      status: 'success',
      count: orders.length,
      data: { orders }
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id, req.user.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    res.json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const order = await Order.updateStatus(id, 'cancelled', req.user.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found or you are not authorized'
      });
    }

    res.json({
      status: 'success',
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

exports.downloadInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id, req.user.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Generate invoice PDF
    const invoiceBuffer = await generateInvoice(order);

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.order_number}.pdf`);

    res.send(invoiceBuffer);
  } catch (error) {
    next(error);
  }
};

exports.addPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, method } = req.body;

    const result = await Order.addPayment(id, { amount, method });

    res.json({
      status: 'success',
      message: 'Payment added successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderStats = async (req, res, next) => {
  try {
    const stats = await Order.getStats(req.user.id);

    res.json({
      status: 'success',
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};

exports.applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    // In a real app, you would validate the coupon code against a database
    // For now, we'll use a simple example
    const validCoupons = {
      'WELCOME10': { discount: 10, type: 'percentage' },
      'FLAT50': { discount: 50, type: 'fixed' },
      'SAVE20': { discount: 20, type: 'percentage' }
    };

    const coupon = validCoupons[code];

    if (!coupon) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid coupon code'
      });
    }

    res.json({
      status: 'success',
      message: 'Coupon applied successfully',
      data: {
        valid: true,
        coupon,
        discount: coupon.type === 'percentage' ? 
          { type: 'percentage', value: coupon.discount } : 
          { type: 'fixed', value: coupon.discount }
      }
    });
  } catch (error) {
    next(error);
  }
};
