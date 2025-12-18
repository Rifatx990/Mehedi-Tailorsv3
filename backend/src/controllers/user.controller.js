const { Measurement } = require('../models');

// Measurements Controller
exports.createMeasurement = async (req, res, next) => {
  try {
    const measurement = await Measurement.create(req.user.id, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Measurement saved successfully',
      data: { measurement }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMeasurements = async (req, res, next) => {
  try {
    const measurements = await Measurement.findByUser(req.user.id);

    res.json({
      status: 'success',
      count: measurements.length,
      data: { measurements }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMeasurement = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const measurement = await Measurement.findById(id, req.user.id);

    if (!measurement) {
      return res.status(404).json({
        status: 'error',
        message: 'Measurement not found'
      });
    }

    res.json({
      status: 'success',
      data: { measurement }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMeasurement = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const measurement = await Measurement.update(id, req.user.id, req.body);

    if (!measurement) {
      return res.status(404).json({
        status: 'error',
        message: 'Measurement not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Measurement updated successfully',
      data: { measurement }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMeasurement = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const measurement = await Measurement.delete(id, req.user.id);

    if (!measurement) {
      return res.status(404).json({
        status: 'error',
        message: 'Measurement not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Measurement deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Wishlist Controller
exports.getWishlist = async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        p.*,
        w.created_at as added_at
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = $1 AND p.deleted_at IS NULL
      ORDER BY w.created_at DESC
    `;

    const result = await query(sql, [req.user.id]);

    res.json({
      status: 'success',
      count: result.rows.length,
      data: { wishlist: result.rows }
    });
  } catch (error) {
    next(error);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const { product_id } = req.body;

    // Check if product exists
    const productCheck = await query(
      'SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL',
      [product_id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Check if already in wishlist
    const existingCheck = await query(
      'SELECT id FROM wishlists WHERE user_id = $1 AND product_id = $2',
      [req.user.id, product_id]
    );

    if (existingCheck.rows.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    const sql = `
      INSERT INTO wishlists (user_id, product_id)
      VALUES ($1, $2)
      RETURNING *
    `;

    const result = await query(sql, [req.user.id, product_id]);

    res.status(201).json({
      status: 'success',
      message: 'Added to wishlist',
      data: { wishlist_item: result.rows[0] }
    });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { product_id } = req.params;

    const sql = `
      DELETE FROM wishlists 
      WHERE user_id = $1 AND product_id = $2
      RETURNING id
    `;

    const result = await query(sql, [req.user.id, product_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found in wishlist'
      });
    }

    res.json({
      status: 'success',
      message: 'Removed from wishlist'
    });
  } catch (error) {
    next(error);
  }
};
