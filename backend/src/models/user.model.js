const db = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {
  static async findAll() {
    const query = `
      SELECT id, name, email, role, COALESCE(is_active, true) as is_active, created_at, updated_at
      FROM users
      ORDER BY id ASC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  static async findByEmail(email) {
    const query = 'SELECT id, name, email, password, role, COALESCE(is_active, true) as is_active, created_at, updated_at FROM users WHERE LOWER(email) = LOWER($1)';
    const { rows } = await db.query(query, [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, role, COALESCE(is_active, true) as is_active, created_at, updated_at FROM users WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  static async create({ name, email, password, role = 'ADMIN', is_active = true }) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (name, email, password, role, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, COALESCE(is_active, true) as is_active, created_at, updated_at
    `;
    const values = [name, email.toLowerCase(), passwordHash, role.toUpperCase(), is_active];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async updateStatus(id, isActive) {
    const query = `
      UPDATE users
      SET is_active = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, name, email, role, COALESCE(is_active, true) as is_active, updated_at
    `;
    const { rows } = await db.query(query, [isActive, id]);
    return rows[0] || null;
  }

  static async updateUser(id, { name, email, role, password }) {
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const query = `
        UPDATE users
        SET name = $1, email = $2, role = $3, password = $4, updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING id, name, email, role, COALESCE(is_active, true) as is_active, updated_at
      `;
      const values = [name, email.toLowerCase(), role.toUpperCase(), passwordHash, id];
      const { rows } = await db.query(query, values);
      return rows[0] || null;
    } else {
      const query = `
        UPDATE users
        SET name = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING id, name, email, role, COALESCE(is_active, true) as is_active, updated_at
      `;
      const values = [name, email.toLowerCase(), role.toUpperCase(), id];
      const { rows } = await db.query(query, values);
      return rows[0] || null;
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = UserModel;
