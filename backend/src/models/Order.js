const { query } = require('../config/database');

class Order {
  static async create(orderData) {
    const {
      user_id,
      items,
      shipping_address,
      payment_method,
      notes,
      coupon_code,
      discount_amount = 0
    } = orderData;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    // Calculate subtotal from items
    for (const item of items) {
      const productSql = `SELECT price, is_customizable, custom_price_multiplier FROM products WHERE id = $1`;
      const productResult = await query(productSql, [item.product_id]);
      
      if (productResult.rows.length === 0) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      const product = productResult.rows[0];
      let itemPrice = product.price;

      // Adjust price for custom items
      if (item.customization && product.is_customizable) {
        itemPrice = product.price * product.custom_price_multiplier;
      }

      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: itemPrice,
        customization: item.customization || null
      });
    }

    const total = subtotal - discount_amount;
    const advance = orderData.advance || 0;
    const due = total - advance;

    // Start transaction
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create order
      const orderSql = `
        INSERT INTO orders (
          user_id, order_number, subtotal, discount_amount, total,
          advance, due, shipping_address, payment_method, notes,
          coupon_code, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending')
        RETURNING *
      `;

      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const orderResult = await client.query(orderSql, [
        user_id,
        orderNumber,
        subtotal,
        discount_amount,
        total,
        advance,
        due,
        JSON.stringify(shipping_address),
        payment_method,
        notes,
        coupon_code
      ]);

      const order = orderResult.rows[0];

      // Create order items
      for (const item of orderItems) {
        const itemSql = `
          INSERT INTO order_items (
            order_id, product_id, quantity, price, customization
          )
          VALUES ($1, $2, $3, $4, $5)
        `;

        await client.query(itemSql, [
          order.id,
          item.product_id,
          item.quantity,
          item.price,
          JSON.stringify(item.customization)
        ]);

        // Update product stock
        if (!item.customization) {
          const updateStockSql = `
            UPDATE products 
            SET stock = stock - $1
            WHERE id = $2
          `;
          await client.query(updateStockSql, [item.quantity, item.product_id]);
        }
      }

      // Create payment record if advance > 0
      if (advance > 0) {
        const paymentSql = `
          INSERT INTO payments (
            order_id, amount, method, status
          )
          VALUES ($1, $2, $3, 'completed')
        `;
        await client.query(paymentSql, [order.id, advance, payment_method]);
      }

      await client.query('COMMIT');

      // Fetch complete order with items
      const completeOrder = await this.findById(order.id, user_id);
      return completeOrder;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findById(id, userId = null) {
    let sql = `
      SELECT 
        o.*,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'product_name', p.name,
              'product_image', p.images->0,
              'quantity', oi.quantity,
              'price', oi.price,
              'customization', oi.customization
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) as items,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', py.id,
              'amount', py.amount,
              'method', py.method,
              'status', py.status,
              'created_at', py.created_at
            )
          ) FILTER (WHERE py.id IS NOT NULL),
          '[]'
        ) as payments
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN payments py ON o.id = py.order_id
      WHERE o.id = $1
    `;

    const values = [id];

    if (userId) {
      sql += ` AND o.user_id = $2`;
      values.push(userId);
    }

    sql += ` GROUP BY o.id`;

    const result = await query(sql, values);
    return result.rows[0];
  }

  static async findByUser(userId, filters = {}) {
    const { status, limit = 20, offset = 0 } = filters;

    let whereConditions = ['o.user_id = $1'];
    const values = [userId];
    let index = 2;

    if (status) {
      whereConditions.push(`o.status = $${index}`);
      values.push(status);
      index++;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    const sql = `
      SELECT 
        o.*,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $${index} OFFSET $${index + 1}
    `;

    values.push(limit, offset);

    const result = await query(sql, values);
    return result.rows;
  }

  static async updateStatus(id, status, userId = null) {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    let sql = `
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;

    const values = [status, id];

    if (userId) {
      sql += ` AND user_id = $3`;
      values.push(userId);
    }

    sql += ` RETURNING *`;

    const result = await query(sql, values);
    return result.rows[0];
  }

  static async addPayment(orderId, paymentData) {
    const { amount, method } = paymentData;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create payment record
      const paymentSql = `
        INSERT INTO payments (order_id, amount, method, status)
        VALUES ($1, $2, $3, 'completed')
        RETURNING *
      `;

      const paymentResult = await client.query(paymentSql, [
        orderId,
        amount,
        method
      ]);

      // Update order due amount
      const updateOrderSql = `
        UPDATE orders 
        SET due = due - $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;

      const orderResult = await client.query(updateOrderSql, [amount, orderId]);

      await client.query('COMMIT');

      return {
        payment: paymentResult.rows[0],
        order: orderResult.rows[0]
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getStats(userId) {
    const sql = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status IN ('pending', 'processing') THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as completed_orders,
        COALESCE(SUM(total), 0) as total_spent,
        COALESCE(SUM(due), 0) as due_balance
      FROM orders
      WHERE user_id = $1
    `;

    const result = await query(sql, [userId]);
    return result.rows[0];
  }
}

module.exports = Order;
