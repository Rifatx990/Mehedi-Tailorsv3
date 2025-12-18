const crypto = require('crypto');

// In a real application, you would integrate with actual payment gateways
// This is a mock implementation for demonstration

exports.initiatePayment = async (req, res, next) => {
  try {
    const { order_id, amount, method } = req.body;

    // Generate payment reference
    const payment_id = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Mock payment initiation
    // In reality, you would call the payment gateway API here
    
    const paymentData = {
      payment_id,
      order_id,
      amount,
      method,
      status: 'pending',
      redirect_url: method === 'card' ? 
        `${process.env.CLIENT_URL}/payment-process/${payment_id}` : null,
      upi_id: method === 'upi' ? 'tailorcraft@upi' : null
    };

    // Save payment to database
    const sql = `
      INSERT INTO payments (order_id, amount, method, status, payment_reference)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await query(sql, [
      order_id,
      amount,
      method,
      'pending',
      payment_id
    ]);

    res.json({
      status: 'success',
      message: 'Payment initiated',
      data: {
        payment: result.rows[0],
        payment_data: paymentData
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { payment_id } = req.params;

    // Mock payment verification
    // In reality, you would verify with the payment gateway
    
    const payment = await query(
      'SELECT * FROM payments WHERE payment_reference = $1',
      [payment_id]
    );

    if (payment.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found'
      });
    }

    // Simulate payment verification
    const isSuccessful = Math.random() > 0.1; // 90% success rate

    if (isSuccessful) {
      // Update payment status
      await query(
        'UPDATE payments SET status = $1, completed_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['completed', payment.rows[0].id]
      );

      // Update order due amount
      await query(
        'UPDATE orders SET due = due - $1 WHERE id = $2',
        [payment.rows[0].amount, payment.rows[0].order_id]
      );

      res.json({
        status: 'success',
        message: 'Payment successful',
        data: { 
          verified: true,
          payment: {
            ...payment.rows[0],
            status: 'completed'
          }
        }
      });
    } else {
      // Update payment status
      await query(
        'UPDATE payments SET status = $1 WHERE id = $2',
        ['failed', payment.rows[0].id]
      );

      res.json({
        status: 'error',
        message: 'Payment failed',
        data: { 
          verified: false,
          payment: {
            ...payment.rows[0],
            status: 'failed'
          }
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getPaymentMethods = async (req, res, next) => {
  try {
    const paymentMethods = [
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when you receive the order',
        icon: 'cash',
        available: true
      },
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Visa, Mastercard, Rupay',
        icon: 'credit-card',
        available: true
      },
      {
        id: 'upi',
        name: 'UPI',
        description: 'Google Pay, PhonePe, Paytm',
        icon: 'mobile',
        available: true
      },
      {
        id: 'netbanking',
        name: 'Net Banking',
        description: 'All major banks',
        icon: 'bank',
        available: true
      }
    ];

    res.json({
      status: 'success',
      data: { paymentMethods }
    });
  } catch (error) {
    next(error);
  }
};
