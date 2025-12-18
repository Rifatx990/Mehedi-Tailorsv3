const { query } = require('../config/database');

class Product {
  static async create(productData) {
    const {
      name,
      description,
      price,
      original_price,
      category,
      material,
      stock,
      is_customizable = false,
      custom_price_multiplier = 1.2,
      images = []
    } = productData;

    const sql = `
      INSERT INTO products (
        name, description, price, original_price, category, 
        material, stock, is_customizable, custom_price_multiplier, 
        images, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const result = await query(sql, [
      name,
      description,
      price,
      original_price,
      category,
      material,
      stock,
      is_customizable,
      custom_price_multiplier,
      JSON.stringify(images)
    ]);

    return result.rows[0];
  }

  static async findById(id) {
    const sql = `
      SELECT 
        p.*,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', pv.id,
              'size', pv.size,
              'color', pv.color,
              'fabric', pv.fabric,
              'stock', pv.stock,
              'price_adjustment', pv.price_adjustment
            )
          ) FILTER (WHERE pv.id IS NOT NULL),
          '[]'
        ) as variants,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.id = $1 AND p.deleted_at IS NULL
      GROUP BY p.id
    `;

    const result = await query(sql, [id]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    const {
      category,
      min_price,
      max_price,
      size,
      color,
      fabric,
      search,
      is_customizable,
      featured,
      sort = 'newest',
      limit = 20,
      offset = 0
    } = filters;

    let whereConditions = ['p.deleted_at IS NULL'];
    const values = [];
    let index = 1;

    if (category) {
      whereConditions.push(`p.category = $${index}`);
      values.push(category);
      index++;
    }

    if (min_price) {
      whereConditions.push(`p.price >= $${index}`);
      values.push(min_price);
      index++;
    }

    if (max_price) {
      whereConditions.push(`p.price <= $${index}`);
      values.push(max_price);
      index++;
    }

    if (size) {
      whereConditions.push(`pv.size = $${index}`);
      values.push(size);
      index++;
    }

    if (color) {
      whereConditions.push(`pv.color = $${index}`);
      values.push(color);
      index++;
    }

    if (fabric) {
      whereConditions.push(`pv.fabric = $${index}`);
      values.push(fabric);
      index++;
    }

    if (search) {
      whereConditions.push(`(
        p.name ILIKE $${index} OR 
        p.description ILIKE $${index} OR 
        p.category ILIKE $${index}
      )`);
      values.push(`%${search}%`);
      index++;
    }

    if (is_customizable !== undefined) {
      whereConditions.push(`p.is_customizable = $${index}`);
      values.push(is_customizable);
      index++;
    }

    if (featured) {
      whereConditions.push(`p.featured = $${index}`);
      values.push(true);
      index++;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Sorting
    let orderBy;
    switch (sort) {
      case 'price-low':
        orderBy = 'p.price ASC';
        break;
      case 'price-high':
        orderBy = 'p.price DESC';
        break;
      case 'popular':
        orderBy = 'average_rating DESC';
        break;
      default:
        orderBy = 'p.created_at DESC';
    }

    const sql = `
      SELECT 
        p.*,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      ${whereClause}
      GROUP BY p.id
      ORDER BY ${orderBy}
      LIMIT $${index} OFFSET $${index + 1}
    `;

    values.push(limit, offset);

    const result = await query(sql, values);
    return result.rows;
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let index = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        if (key === 'images') {
          fields.push(`images = $${index}`);
          values.push(JSON.stringify(updateData[key]));
        } else {
          fields.push(`${key} = $${index}`);
          values.push(updateData[key]);
        }
        index++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const sql = `
      UPDATE products 
      SET ${fields.join(', ')}
      WHERE id = $${index} AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await query(sql, values);
    return result.rows[0];
  }

  static async delete(id) {
    const sql = `
      UPDATE products 
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await query(sql, [id]);
    return result.rows[0];
  }

  static async updateStock(id, quantity) {
    const sql = `
      UPDATE products 
      SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND stock >= $1 AND deleted_at IS NULL
      RETURNING id, stock
    `;

    const result = await query(sql, [quantity, id]);
    return result.rows[0];
  }

  static async getCategories() {
    const sql = `
      SELECT DISTINCT category, 
             COUNT(*) as product_count
      FROM products 
      WHERE deleted_at IS NULL
      GROUP BY category
      ORDER BY category
    `;

    const result = await query(sql);
    return result.rows;
  }

  static async getFilters() {
    const sql = `
      SELECT 
        json_build_object(
          'categories', (
            SELECT json_agg(DISTINCT category)
            FROM products WHERE deleted_at IS NULL
          ),
          'sizes', (
            SELECT json_agg(DISTINCT size)
            FROM product_variants WHERE size IS NOT NULL
          ),
          'colors', (
            SELECT json_agg(DISTINCT color)
            FROM product_variants WHERE color IS NOT NULL
          ),
          'fabrics', (
            SELECT json_agg(DISTINCT fabric)
            FROM product_variants WHERE fabric IS NOT NULL
          ),
          'price_range', (
            SELECT json_build_object(
              'min', MIN(price),
              'max', MAX(price)
            )
            FROM products WHERE deleted_at IS NULL
          )
        ) as filters
    `;

    const result = await query(sql);
    return result.rows[0].filters;
  }
}

module.exports = Product;
