const db = require('../config/db');

class CategoryModel {
  static async findAll() {
    const query = `
      SELECT c.*, COUNT(p.id)::int AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  static async findBySlug(slug) {
    const query = 'SELECT * FROM categories WHERE slug = $1';
    const { rows } = await db.query(query, [slug]);
    return rows[0] || null;
  }

  static async create({ name, slug, description }) {
    const query = `
      INSERT INTO categories (name, slug, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await db.query(query, [name, slug, description || null]);
    return rows[0];
  }

  static async update(id, { name, slug, description }) {
    const query = `
      UPDATE categories
      SET name = COALESCE($1, name),
          slug = COALESCE($2, slug),
          description = COALESCE($3, description)
      WHERE id = $4
      RETURNING *
    `;
    const { rows } = await db.query(query, [name, slug, description, id]);
    return rows[0] || null;
  }

  static async delete(id) {
    const query = 'DELETE FROM categories WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }
}

module.exports = CategoryModel;
