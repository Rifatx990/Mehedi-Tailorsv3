const crypto = require('crypto');

// Generate random string
exports.generateRandomString = (length = 10) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

// Generate order number
exports.generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Format currency
exports.formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

// Calculate discount
exports.calculateDiscount = (originalPrice, discountedPrice) => {
  const discount = originalPrice - discountedPrice;
  const percentage = (discount / originalPrice) * 100;
  return {
    amount: discount,
    percentage: Math.round(percentage)
  };
};

// Sanitize object (remove undefined/null values)
exports.sanitizeObject = (obj) => {
  const sanitized = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null) {
      sanitized[key] = obj[key];
    }
  });
  return sanitized;
};

// Pagination helper
exports.getPagination = (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};

// Calculate estimated delivery date
exports.calculateDeliveryDate = (isCustom = false, urgency = 'standard') => {
  const today = new Date();
  let daysToAdd = isCustom ? 14 : 7; // Base days

  // Adjust based on urgency
  switch (urgency) {
    case 'express':
      daysToAdd = isCustom ? 7 : 3;
      break;
    case 'urgent':
      daysToAdd = isCustom ? 4 : 2;
      break;
    case 'standard':
    default:
      daysToAdd = isCustom ? 14 : 7;
  }

  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + daysToAdd);
  
  return deliveryDate.toISOString().split('T')[0]; // Return YYYY-MM-DD
};
