const db = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
    const { rows } = await db.query(query, [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  static async create({ name, email, password, role = 'ADMIN' }) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at, updated_at
    `;
    const values = [name, email.toLowerCase(), passwordHash, role.toUpperCase()];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = UserModel;
