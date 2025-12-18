const { Product } = require('../models');

exports.getAllProducts = async (req, res, next) => {
  try {
    const filters = req.query;
    
    const products = await Product.findAll(filters);

    res.json({
      status: 'success',
      count: products.length,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    
    // Handle image uploads
    if (req.files) {
      productData.images = req.files.map(file => file.path);
    }

    const product = await Product.create(productData);

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle image uploads
    if (req.files) {
      updateData.images = req.files.map(file => file.path);
    }

    const product = await Product.update(id, updateData);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.delete(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.getCategories();

    res.json({
      status: 'success',
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
};

exports.getFilters = async (req, res, next) => {
  try {
    const filters = await Product.getFilters();

    res.json({
      status: 'success',
      data: { filters }
    });
  } catch (error) {
    next(error);
  }
};

exports.searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    const products = await Product.findAll({ search: q });

    res.json({
      status: 'success',
      count: products.length,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
};
