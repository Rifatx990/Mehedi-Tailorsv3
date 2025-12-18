const { query } = require('../config/database');

exports.isEmailUnique = async (email, excludeUserId = null) => {
  let sql = 'SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL';
  const values = [email];

  if (excludeUserId) {
    sql += ' AND id != $2';
    values.push(excludeUserId);
  }

  const result = await query(sql, values);
  return result.rows.length === 0;
};

exports.isProductExists = async (productId) => {
  const result = await query(
    'SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL',
    [productId]
  );
  return result.rows.length > 0;
};

exports.isOrderExists = async (orderId, userId = null) => {
  let sql = 'SELECT id FROM orders WHERE id = $1';
  const values = [orderId];

  if (userId) {
    sql += ' AND user_id = $2';
    values.push(userId);
  }

  const result = await query(sql, values);
  return result.rows.length > 0;
};

exports.isValidCoupon = async (couponCode) => {
  // In a real app, you would check against a coupons table
  const validCoupons = ['WELCOME10', 'FLAT50', 'SAVE20'];
  return validCoupons.includes(couponCode);
};

exports.validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

exports.validatePassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password);
};
