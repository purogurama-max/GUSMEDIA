const db = require('../config/db');

class ProductModel {
  static async findAll({ search, category_id, status, limit, offset } = {}) {
    const conditions = [];
    const values = [];
    let idx = 1;

    if (search) {
      conditions.push(`(p.name ILIKE $${idx} OR p.description ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }
    if (category_id) {
      conditions.push(`p.category_id = $${idx}`);
      values.push(category_id);
      idx++;
    }
    if (status) {
      conditions.push(`p.status = $${idx}`);
      values.push(status.toUpperCase());
      idx++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total
    const countQuery = `SELECT COUNT(*) FROM products p ${where}`;
    const countResult = await db.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count, 10);

    // Actual data
    let dataQuery = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${where}
      ORDER BY p.created_at DESC
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
    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  static async findBySlug(slug) {
    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1
    `;
    const { rows } = await db.query(query, [slug]);
    return rows[0] || null;
  }

  static async create({ name, slug, description, price, category_id, image, status }) {
    const query = `
      INSERT INTO products (name, slug, description, price, category_id, image, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      name,
      slug,
      description || '',
      price || 0.00,
      category_id || null,
      image || null,
      status || 'ACTIVE',
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async update(id, { name, slug, description, price, category_id, image, status }) {
    const query = `
      UPDATE products
      SET name = COALESCE($1, name),
          slug = COALESCE($2, slug),
          description = COALESCE($3, description),
          price = COALESCE($4, price),
          category_id = COALESCE($5, category_id),
          image = COALESCE($6, image),
          status = COALESCE($7, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;
    const values = [name, slug, description, price, category_id, image, status, id];
    const { rows } = await db.query(query, values);
    return rows[0] || null;
  }

  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }
}

module.exports = ProductModel;
