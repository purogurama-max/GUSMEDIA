const db = require('../config/db');

class InvoiceModel {
  // Generate invoice number format: INV-YYYY-NNNNNN
  static async generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;

    const query = `
      SELECT invoice_number 
      FROM invoices 
      WHERE invoice_number LIKE $1 
      ORDER BY id DESC 
      LIMIT 1
    `;
    const result = await db.query(query, [`${prefix}%`]);

    let nextNumber = 1;
    if (result.rows.length > 0) {
      const lastInvoice = result.rows[0].invoice_number;
      const parts = lastInvoice.split('-');
      if (parts.length === 3) {
        const parsed = parseInt(parts[2], 10);
        if (!isNaN(parsed)) {
          nextNumber = parsed + 1;
        }
      }
    }

    const paddedNumber = String(nextNumber).padStart(6, '0');
    return `${prefix}${paddedNumber}`;
  }

  // Find all invoices with search, payment_status filter, & pagination
  static async findAll({ search, payment_status, limit, offset }) {
    let whereClause = [];
    let values = [];
    let paramIndex = 1;

    if (search) {
      whereClause.push(
        `(i.invoice_number ILIKE $${paramIndex} OR o.order_number ILIKE $${paramIndex} OR c.name ILIKE $${paramIndex})`
      );
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (payment_status) {
      whereClause.push(`i.payment_status = $${paramIndex}`);
      values.push(payment_status.toUpperCase());
      paramIndex++;
    }

    const whereString = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(i.id) AS total 
      FROM invoices i
      JOIN orders o ON i.order_id = o.id
      JOIN customers c ON o.customer_id = c.id
      ${whereString}
    `;
    const countRes = await db.query(countQuery, values);
    const total = parseInt(countRes.rows[0].total, 10);

    let dataQuery = `
      SELECT 
        i.id,
        i.invoice_number,
        i.order_id,
        o.order_number,
        c.id AS customer_id,
        c.name AS customer_name,
        c.email AS customer_email,
        i.issue_date,
        i.due_date,
        i.subtotal,
        i.discount,
        i.tax,
        i.grand_total,
        i.payment_status,
        i.notes,
        i.created_at,
        i.updated_at,
        COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.invoice_id = i.id AND p.status = 'PAID'), 0) AS total_paid,
        (i.grand_total - COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.invoice_id = i.id AND p.status = 'PAID'), 0)) AS outstanding
      FROM invoices i
      JOIN orders o ON i.order_id = o.id
      JOIN customers c ON o.customer_id = c.id
      ${whereString}
      ORDER BY i.id DESC
    `;

    if (limit) {
      dataQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      values.push(limit, offset || 0);
    }

    const dataRes = await db.query(dataQuery, values);
    return { rows: dataRes.rows, total };
  }

  // Find invoice by ID with order details & items
  static async findById(id) {
    const invoiceQuery = `
      SELECT 
        i.id,
        i.invoice_number,
        i.order_id,
        o.order_number,
        o.order_date,
        c.id AS customer_id,
        c.name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone,
        c.company AS customer_company,
        c.address AS customer_address,
        i.issue_date,
        i.due_date,
        i.subtotal,
        i.discount,
        i.tax,
        i.grand_total,
        i.payment_status,
        i.notes,
        i.created_at,
        i.updated_at
      FROM invoices i
      JOIN orders o ON i.order_id = o.id
      JOIN customers c ON o.customer_id = c.id
      WHERE i.id = $1
    `;
    const invoiceRes = await db.query(invoiceQuery, [id]);

    if (invoiceRes.rows.length === 0) {
      return null;
    }

    const invoice = invoiceRes.rows[0];

    // Fetch order items
    const itemsQuery = `
      SELECT 
        oi.id,
        oi.product_id,
        p.name AS product_name,
        p.slug AS product_slug,
        oi.quantity,
        oi.price,
        oi.subtotal
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `;
    const itemsRes = await db.query(itemsQuery, [invoice.order_id]);
    invoice.items = itemsRes.rows;

    return invoice;
  }

  // Find invoice by Order ID
  static async findByOrderId(orderId) {
    const query = `SELECT * FROM invoices WHERE order_id = $1`;
    const result = await db.query(query, [orderId]);
    return result.rows[0] || null;
  }

  // Create Invoice from Order
  static async createFromOrder({ order_id, due_days = 30, notes = '' }) {
    // 1. Fetch Order
    const orderQuery = `SELECT * FROM orders WHERE id = $1`;
    const orderRes = await db.query(orderQuery, [order_id]);

    if (orderRes.rows.length === 0) {
      throw new Error(`Order with ID ${order_id} not found`);
    }

    const order = orderRes.rows[0];

    // 2. Check if invoice already exists for this order
    const existing = await this.findByOrderId(order_id);
    if (existing) {
      throw new Error(`Invoice already exists for order ${order.order_number}`);
    }

    // 3. Generate unique invoice number
    const invoiceNumber = await this.generateInvoiceNumber();

    // 4. Calculate issue date and due date
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + parseInt(due_days, 10));

    const insertQuery = `
      INSERT INTO invoices (
        invoice_number,
        order_id,
        issue_date,
        due_date,
        subtotal,
        discount,
        tax,
        grand_total,
        payment_status,
        notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      invoiceNumber,
      order_id,
      issueDate.toISOString().split('T')[0],
      dueDate.toISOString().split('T')[0],
      order.subtotal,
      order.discount,
      order.tax,
      order.grand_total,
      'UNPAID',
      notes || order.notes || '',
    ];

    const result = await db.query(insertQuery, values);

    // Update corresponding order status to COMPLETED
    await db.query(`UPDATE orders SET status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [order_id]);

    return result.rows[0];
  }

  // Update payment_status
  static async updatePaymentStatus(id, paymentStatus) {
    const validStatuses = ['UNPAID', 'PARTIAL', 'PAID'];
    const statusUpper = paymentStatus.toUpperCase();

    if (!validStatuses.includes(statusUpper)) {
      throw new Error(`Invalid payment status: ${paymentStatus}. Allowed: ${validStatuses.join(', ')}`);
    }

    const query = `
      UPDATE invoices
      SET payment_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [statusUpper, id]);
    return result.rows[0];
  }

  // Recalculate payment_status based on total payments recorded
  static async recalculatePaymentStatus(id) {
    const invRes = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
    if (invRes.rows.length === 0) {
      return null;
    }
    const invoice = invRes.rows[0];
    const grandTotal = parseFloat(invoice.grand_total);

    const paidRes = await db.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_paid FROM payments WHERE invoice_id = $1 AND status = 'PAID'`,
      [id]
    );
    const totalPaid = parseFloat(paidRes.rows[0].total_paid);

    let newStatus = 'UNPAID';
    if (totalPaid <= 0) {
      newStatus = 'UNPAID';
    } else if (totalPaid < grandTotal) {
      newStatus = 'PARTIAL';
    } else {
      newStatus = 'PAID';
    }

    const updateRes = await db.query(
      `UPDATE invoices SET payment_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [newStatus, id]
    );
    const updatedInvoice = updateRes.rows[0];
    updatedInvoice.total_paid = totalPaid;
    updatedInvoice.outstanding = Math.max(0, grandTotal - totalPaid);
    return updatedInvoice;
  }

  // Delete invoice and associated payments
  static async delete(id) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const invRes = await client.query('SELECT * FROM invoices WHERE id = $1', [id]);
      if (invRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      // Delete payments for this invoice
      await client.query('DELETE FROM payments WHERE invoice_id = $1', [id]);

      // Delete the invoice record
      const deleteRes = await client.query('DELETE FROM invoices WHERE id = $1 RETURNING *', [id]);

      await client.query('COMMIT');
      return deleteRes.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = InvoiceModel;
