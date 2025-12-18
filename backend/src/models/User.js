const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

class User {
  static async create(userData) {
    const {
      name,
      email,
      password,
      phone,
      role = 'customer'
    } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (name, email, password, phone, role, created_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      RETURNING id, name, email, phone, role, created_at
    `;

    const result = await query(sql, [
      name,
      email,
      hashedPassword,
      phone,
      role
    ]);

    return result.rows[0];
  }

  static async findByEmail(email) {
    const sql = `
      SELECT * FROM users 
      WHERE email = $1 AND deleted_at IS NULL
    `;
    const result = await query(sql, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const sql = `
      SELECT id, name, email, phone, role, created_at, updated_at
      FROM users 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let index = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(updateData[key]);
        index++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const sql = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${index} AND deleted_at IS NULL
      RETURNING id, name, email, phone, role, updated_at
    `;

    const result = await query(sql, values);
    return result.rows[0];
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const sql = `
      UPDATE users 
      SET password = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await query(sql, [hashedPassword, id]);
    return result.rows[0];
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;
