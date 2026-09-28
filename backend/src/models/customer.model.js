const db = require('../config/db');

class CustomerModel {
  static async findAll({ search, limit, offset } = {}) {
    const conditions = [];
    const values = [];
    let idx = 1;

    if (search) {
      conditions.push(`(name ILIKE $${idx} OR email ILIKE $${idx} OR company ILIKE $${idx} OR phone ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total
    const countQuery = `SELECT COUNT(*) FROM customers ${where}`;
    const countResult = await db.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count, 10);

    // Actual data
    let dataQuery = `
      SELECT *
      FROM customers
      ${where}
      ORDER BY created_at DESC
    `;
    const dataValues = [...values];
    if (limit !== undefined) {
      dataQuery += ` LIMIT $${idx}`;
      dataValues.push(parseInt(limit, 10));
      idx++;
    }
    if (offset !== undefined) {
      dataQuery += ` OFFSET $${idx}`;
      dataValues.push(parseInt(offset, 10));
      idx++;
    }

    const { rows } = await db.query(dataQuery, dataValues);
    return { rows, total };
  }

  static async findById(id) {
    const query = 'SELECT * FROM customers WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM customers WHERE LOWER(email) = LOWER($1)';
    const { rows } = await db.query(query, [email]);
    return rows[0] || null;
  }

  static async create({ name, email, phone, company, address }) {
    const query = `
      INSERT INTO customers (name, email, phone, company, address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      name,
      email,
      phone || null,
      company || null,
      address || null,
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async update(id, { name, email, phone, company, address }) {
    const query = `
      UPDATE customers
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          phone = COALESCE($3, phone),
          company = COALESCE($4, company),
          address = COALESCE($5, address),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;
    const values = [name, email, phone, company, address, id];
    const { rows } = await db.query(query, values);
    return rows[0] || null;
  }

  static async delete(id) {
    const query = 'DELETE FROM customers WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }
}

module.exports = CustomerModel;
