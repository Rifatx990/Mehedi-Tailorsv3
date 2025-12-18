const { verifyToken } = require('../config/jwt');
const { query } = require('../config/database');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized. Please login.'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }

    // Check if user still exists
    const user = await query(
      'SELECT id, email, role FROM users WHERE id = $1 AND deleted_at IS NULL',
      [decoded.id]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists'
      });
    }

    // Grant access
    req.user = user.rows[0];
    next();
  } catch (error) {
    next(error);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

exports.isOwner = (resourceUserId) => {
  return (req, res, next) => {
    // If user is admin, allow access
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    if (req.user.id !== resourceUserId) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only access your own resources'
      });
    }
    next();
  };
};
