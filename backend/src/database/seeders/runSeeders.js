const { query } = require('../../config/database');
const bcrypt = require('bcryptjs');

const runSeeders = async () => {
  try {
    console.log('🌱 Starting database seeders...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await query(`
      INSERT INTO users (name, email, password, role)
      VALUES ('Admin User', 'admin@tailorcraft.com', $1, 'admin')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);
    console.log('✅ Created admin user');

    // Create sample categories and products
    const categories = [
      'Shirts',
      'Pants',
      'Suits',
      'Kurtas',
      'Blouses',
      'Lehenga',
      'Sarees',
      'Jackets'
    ];

    for (const category of categories) {
      // Create sample products for each category
      for (let i = 1; i <= 5; i++) {
        const price = Math.floor(Math.random() * 5000) + 1000;
        const originalPrice = price + Math.floor(Math.random() * 1000);

        await query(`
          INSERT INTO products (
            name, description, price, original_price, category,
            material, stock, is_customizable, images
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT DO NOTHING
        `, [
          `${category} Design ${i}`,
          `Premium quality ${category.toLowerCase()} made with the finest materials. Perfect for any occasion.`,
          price,
          originalPrice,
          category,
          'Cotton Blend',
          Math.floor(Math.random() * 100) + 10,
          i % 2 === 0, // Every other product is customizable
          JSON.stringify([
            `https://picsum.photos/seed/${category}${i}/400/400`,
            `https://picsum.photos/seed/${category}${i}b/400/400`
          ])
        ]);
      }
    }
    console.log('✅ Created sample products');

    // Create product variants
    const products = await query('SELECT id FROM products');
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Navy', 'Beige'];
    const fabrics = ['Cotton', 'Linen', 'Silk', 'Wool', 'Polyester', 'Denim'];

    for (const product of products.rows) {
      // Create 2-4 variants per product
      const variantCount = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < variantCount; i++) {
        await query(`
          INSERT INTO product_variants (
            product_id, size, color, fabric, stock, price_adjustment
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `, [
          product.id,
          sizes[Math.floor(Math.random() * sizes.length)],
          colors[Math.floor(Math.random() * colors.length)],
          fabrics[Math.floor(Math.random() * fabrics.length)],
          Math.floor(Math.random() * 50) + 5,
          Math.floor(Math.random() * 500) - 250
        ]);
      }
    }
    console.log('✅ Created product variants');

    console.log('🎉 All seeders completed successfully!');
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
  }
};

// Run seeders if this file is executed directly
if (require.main === module) {
  runSeeders().then(() => process.exit(0));
}

module.exports = runSeeders;
