const { body, param, query, validationResult } = require('express-validator');

exports.validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: formattedErrors
    });
  };
};

// Auth validations
exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be 10 digits')
];

exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Product validations
exports.productValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a positive integer'),
  
  body('is_customizable')
    .optional()
    .isBoolean()
    .withMessage('is_customizable must be true or false')
];

// Order validations
exports.orderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must have at least one item'),
  
  body('items.*.product_id')
    .notEmpty()
    .withMessage('Product ID is required for each item')
    .isInt()
    .withMessage('Product ID must be an integer'),
  
  body('items.*.quantity')
    .notEmpty()
    .withMessage('Quantity is required for each item')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  body('shipping_address')
    .notEmpty()
    .withMessage('Shipping address is required')
    .isObject()
    .withMessage('Shipping address must be an object'),
  
  body('shipping_address.fullName')
    .notEmpty()
    .withMessage('Full name is required'),
  
  body('shipping_address.address')
    .notEmpty()
    .withMessage('Address is required'),
  
  body('shipping_address.city')
    .notEmpty()
    .withMessage('City is required'),
  
  body('shipping_address.state')
    .notEmpty()
    .withMessage('State is required'),
  
  body('shipping_address.zipCode')
    .notEmpty()
    .withMessage('ZIP code is required'),
  
  body('payment_method')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['cod', 'card', 'upi', 'netbanking'])
    .withMessage('Invalid payment method')
];

// Measurement validations
exports.measurementValidation = [
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Measurement type is required')
    .isIn(['shirt', 'pant', 'suit', 'kurta', 'blouse', 'other'])
    .withMessage('Invalid measurement type'),
  
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Measurement name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('data')
    .isObject()
    .withMessage('Measurement data must be an object')
];

// Query param validations
exports.paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['newest', 'price-low', 'price-high', 'popular'])
    .withMessage('Invalid sort parameter')
];
