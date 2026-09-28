const db = require('../config/db');

class OrderModel {
  static async generateOrderNumber() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const datePrefix = `ORD-${year}${month}${day}`;

    // Get latest order for today
    const query = `
      SELECT order_number
      FROM orders
      WHERE order_number LIKE $1
      ORDER BY id DESC
      LIMIT 1
    `;
    const { rows } = await db.query(query, [`${datePrefix}-%`]);

    let seq = 1;
    if (rows.length > 0) {
      const lastSeqStr = rows[0].order_number.split('-').pop();
      const lastSeq = parseInt(lastSeqStr, 10);
      if (!isNaN(lastSeq)) {
        seq = lastSeq + 1;
      }
    }

    return `${datePrefix}-${String(seq).padStart(4, '0')}`;
  }

  static async findAll({ search, status, customer_id, limit, offset } = {}) {
    const conditions = [];
    const values = [];
    let idx = 1;

    if (search) {
      conditions.push(`(o.order_number ILIKE $${idx} OR c.name ILIKE $${idx} OR c.company ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }
    if (status) {
      conditions.push(`o.status = $${idx}`);
      values.push(status.toUpperCase());
      idx++;
    }
    if (customer_id) {
      conditions.push(`o.customer_id = $${idx}`);
      values.push(customer_id);
      idx++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*)
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ${where}
    `;
    const countResult = await db.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count, 10);

    let dataQuery = `
      SELECT o.*, c.name as customer_name, c.email as customer_email, c.company as customer_company
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ${where}
      ORDER BY o.created_at DESC
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
    const orderQuery = `
      SELECT o.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.company as customer_company, c.address as customer_address
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = $1
    `;
    const { rows: orderRows } = await db.query(orderQuery, [id]);
    if (orderRows.length === 0) return null;

    const order = orderRows[0];

    const itemsQuery = `
      SELECT oi.*, p.name as product_name, p.slug as product_slug, p.image as product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.id ASC
    `;
    const { rows: itemRows } = await db.query(itemsQuery, [id]);
    order.items = itemRows;

    return order;
  }

  static async createOrderWithItems({ customer_id, items, discount = 0, tax = 0, notes = '' }) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Calculate totals
      let subtotal = 0;
      const processedItems = [];

      for (const item of items) {
        const prodRes = await client.query('SELECT id, price, name FROM products WHERE id = $1', [item.product_id]);
        if (prodRes.rows.length === 0) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }
        const prod = prodRes.rows[0];
        const price = Number(item.price !== undefined ? item.price : prod.price);
        const qty = parseInt(item.quantity, 10) || 1;
        const itemSubtotal = price * qty;
        subtotal += itemSubtotal;

        processedItems.push({
          product_id: prod.id,
          quantity: qty,
          price,
          subtotal: itemSubtotal,
        });
      }

      const discountNum = Number(discount) || 0;
      const taxNum = Number(tax) || 0;
      const grandTotal = Math.max(0, subtotal - discountNum + taxNum);
      const orderNumber = await OrderModel.generateOrderNumber();

      // Insert Order
      const insertOrderQuery = `
        INSERT INTO orders (order_number, customer_id, subtotal, discount, tax, grand_total, notes, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING')
        RETURNING *
      `;
      const orderRes = await client.query(insertOrderQuery, [
        orderNumber,
        customer_id,
        subtotal,
        discountNum,
        taxNum,
        grandTotal,
        notes || '',
      ]);
      const createdOrder = orderRes.rows[0];

      // Insert Order Items
      const createdItems = [];
      for (const pItem of processedItems) {
        const insertItemQuery = `
          INSERT INTO order_items (order_id, product_id, quantity, price, subtotal)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        const itemRes = await client.query(insertItemQuery, [
          createdOrder.id,
          pItem.product_id,
          pItem.quantity,
          pItem.price,
          pItem.subtotal,
        ]);
        createdItems.push(itemRes.rows[0]);
      }

      await client.query('COMMIT');
      createdOrder.items = createdItems;
      return createdOrder;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async updateStatus(id, status) {
    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
    const upperStatus = status.toUpperCase();

    if (!validStatuses.includes(upperStatus)) {
      throw new Error(`Invalid status. Allowed values: ${validStatuses.join(', ')}`);
    }

    const query = `
      UPDATE orders
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const { rows } = await db.query(query, [upperStatus, id]);
    return rows[0] || null;
  }
}

module.exports = OrderModel;
