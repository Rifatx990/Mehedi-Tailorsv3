const { query } = require('../../config/database');

const runMigrations = async () => {
  try {
    console.log('🚀 Starting database migrations...');

    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'customer',
        reset_password_token VARCHAR(255),
        reset_password_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      )
    `);
    console.log('✅ Created users table');

    // Products table
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        category VARCHAR(100),
        material VARCHAR(100),
        stock INTEGER DEFAULT 0,
        is_customizable BOOLEAN DEFAULT false,
        custom_price_multiplier DECIMAL(3,2) DEFAULT 1.2,
        featured BOOLEAN DEFAULT false,
        images JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      )
    `);
    console.log('✅ Created products table');

    // Product variants table
    await query(`
      CREATE TABLE IF NOT EXISTS product_variants (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        size VARCHAR(20),
        color VARCHAR(50),
        fabric VARCHAR(100),
        stock INTEGER DEFAULT 0,
        price_adjustment DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created product_variants table');

    // Orders table
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        order_number VARCHAR(50) UNIQUE NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) NOT NULL,
        advance DECIMAL(10,2) DEFAULT 0,
        due DECIMAL(10,2) DEFAULT 0,
        shipping_address JSONB NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        notes TEXT,
        coupon_code VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        estimated_delivery DATE,
        tracking_number VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created orders table');

    // Order items table
    await query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        customization JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created order_items table');

    // Measurements table
    await query(`
      CREATE TABLE IF NOT EXISTS measurements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      )
    `);
    console.log('✅ Created measurements table');

    // Wishlist table
    await query(`
      CREATE TABLE IF NOT EXISTS wishlists (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);
    console.log('✅ Created wishlists table');

    // Payments table
    await query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        method VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        payment_reference VARCHAR(100),
        gateway_response JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);
    console.log('✅ Created payments table');

    // Reviews table
    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        images JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created reviews table');

    // Create indexes for better performance
    await query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await query('CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at)');
    await query('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)');
    await query('CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products(deleted_at)');
    await query('CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)');
    await query('CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_measurements_user_id ON measurements(user_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id)');

    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations().then(() => process.exit(0));
}

module.exports = runMigrations;
