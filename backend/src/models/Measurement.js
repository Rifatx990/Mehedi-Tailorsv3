const { query } = require('../config/database');

class Measurement {
  static async create(userId, measurementData) {
    const { type, data, name } = measurementData;

    const sql = `
      INSERT INTO measurements (user_id, type, data, name, created_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const result = await query(sql, [
      userId,
      type,
      JSON.stringify(data),
      name
    ]);

    return result.rows[0];
  }

  static async findByUser(userId) {
    const sql = `
      SELECT * FROM measurements
      WHERE user_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    const result = await query(sql, [userId]);
    return result.rows;
  }

  static async findById(id, userId) {
    const sql = `
      SELECT * FROM measurements
      WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
    `;

    const result = await query(sql, [id, userId]);
    return result.rows[0];
  }

  static async update(id, userId, updateData) {
    const fields = [];
    const values = [];
    let index = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        if (key === 'data') {
          fields.push(`data = $${index}`);
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
    values.push(id, userId);

    const sql = `
      UPDATE measurements 
      SET ${fields.join(', ')}
      WHERE id = $${index} AND user_id = $${index + 1} AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await query(sql, values);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const sql = `
      UPDATE measurements 
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await query(sql, [id, userId]);
    return result.rows[0];
  }
}

module.exports = Measurement;
