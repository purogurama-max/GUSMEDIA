const db = require('../config/db');

const VALID_METHODS = ['TRANSFER', 'CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'EWALLET', 'CHEQUE'];
const VALID_STATUSES = ['PAID', 'REFUNDED', 'FAILED'];

class PaymentModel {
  // --- Record a new payment against an invoice ---
  static async create({ invoice_id, amount, payment_method, payment_date, notes = '' }) {
    const methodUpper = payment_method?.toUpperCase();
    if (!VALID_METHODS.includes(methodUpper)) {
      throw new Error(`Invalid payment_method: ${payment_method}. Allowed: ${VALID_METHODS.join(', ')}`);
    }

    // Fetch invoice to verify and calculate outstanding
    const invRes = await db.query('SELECT * FROM invoices WHERE id = $1', [invoice_id]);
    if (invRes.rows.length === 0) {
      throw new Error(`Invoice with ID ${invoice_id} not found`);
    }
    const invoice = invRes.rows[0];

    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Insert payment record
      const insertQuery = `
        INSERT INTO payments (invoice_id, amount, payment_method, payment_date, status, notes)
        VALUES ($1, $2, $3, $4, 'PAID', $5)
        RETURNING *
      `;
      const payResult = await client.query(insertQuery, [
        invoice_id,
        parseFloat(amount),
        methodUpper,
        payment_date || new Date().toISOString(),
        notes,
      ]);
      const payment = payResult.rows[0];

      // Recalculate total paid for this invoice
      const paidRes = await client.query(
        `SELECT COALESCE(SUM(amount), 0) AS total_paid
         FROM payments WHERE invoice_id = $1 AND status = 'PAID'`,
        [invoice_id]
      );
      const totalPaid = parseFloat(paidRes.rows[0].total_paid);
      const grandTotal = parseFloat(invoice.grand_total);

      let newStatus;
      if (totalPaid <= 0) {
        newStatus = 'UNPAID';
      } else if (totalPaid < grandTotal) {
        newStatus = 'PARTIAL';
      } else {
        newStatus = 'PAID';
      }

      // Update invoice payment_status
      await client.query(
        `UPDATE invoices SET payment_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [newStatus, invoice_id]
      );

      await client.query('COMMIT');

      payment.invoice_payment_status = newStatus;
      payment.total_paid = totalPaid;
      payment.outstanding = Math.max(0, grandTotal - totalPaid);
      return payment;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // --- Get all payments with optional invoice_id filter & pagination ---
  static async findAll({ invoice_id, page = 1, limit } = {}) {
    const conditions = [];
    const values = [];
    let idx = 1;

    if (invoice_id) {
      conditions.push(`p.invoice_id = $${idx}`);
      values.push(invoice_id);
      idx++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRes = await db.query(
      `SELECT COUNT(*) FROM payments p ${where}`,
      values
    );
    const total = parseInt(countRes.rows[0].count, 10);

    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offset = limitNum ? (parseInt(page, 10) - 1) * limitNum : 0;

    let dataQuery = `
      SELECT
        p.id,
        p.invoice_id,
        i.invoice_number,
        p.payment_date,
        p.amount,
        p.payment_method,
        p.status,
        p.notes,
        p.created_at,
        c.name AS customer_name
      FROM payments p
      JOIN invoices i ON p.invoice_id = i.id
      JOIN orders o ON i.order_id = o.id
      JOIN customers c ON o.customer_id = c.id
      ${where}
      ORDER BY p.payment_date DESC, p.id DESC
    `;

    const dataValues = [...values];
    if (limitNum) {
      dataQuery += ` LIMIT $${idx} OFFSET $${idx + 1}`;
      dataValues.push(limitNum, offset);
    }

    const dataRes = await db.query(dataQuery, dataValues);
    return { rows: dataRes.rows, total };
  }

  // --- Get payment history for a specific invoice with outstanding calculation ---
  static async getHistoryByInvoice(invoiceId) {
    const invRes = await db.query('SELECT * FROM invoices WHERE id = $1', [invoiceId]);
    if (invRes.rows.length === 0) return null;
    const invoice = invRes.rows[0];

    const paymentsRes = await db.query(
      `SELECT p.*, c.name AS customer_name
       FROM payments p
       JOIN invoices i ON p.invoice_id = i.id
       JOIN orders o ON i.order_id = o.id
       JOIN customers c ON o.customer_id = c.id
       WHERE p.invoice_id = $1
       ORDER BY p.payment_date ASC`,
      [invoiceId]
    );

    const totalPaid = paymentsRes.rows
      .filter((p) => p.status === 'PAID')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    const grandTotal = parseFloat(invoice.grand_total);
    const outstanding = Math.max(0, grandTotal - totalPaid);

    return {
      invoice_id: invoice.id,
      invoice_number: invoice.invoice_number,
      grand_total: grandTotal,
      total_paid: totalPaid,
      outstanding,
      payment_status: invoice.payment_status,
      payments: paymentsRes.rows,
    };
  }

  // --- Get outstanding invoices (payment_status != PAID) ---
  static async getOutstanding() {
    const query = `
      SELECT
        i.id AS invoice_id,
        i.invoice_number,
        i.grand_total,
        i.payment_status,
        i.due_date,
        o.order_number,
        c.name AS customer_name,
        c.email AS customer_email,
        COALESCE(
          (SELECT SUM(amount) FROM payments
           WHERE invoice_id = i.id AND status = 'PAID'), 0
        ) AS total_paid,
        i.grand_total - COALESCE(
          (SELECT SUM(amount) FROM payments
           WHERE invoice_id = i.id AND status = 'PAID'), 0
        ) AS outstanding
      FROM invoices i
      JOIN orders o ON i.order_id = o.id
      JOIN customers c ON o.customer_id = c.id
      WHERE i.payment_status != 'PAID'
      ORDER BY i.due_date ASC
    `;
    const res = await db.query(query);
    return res.rows;
  }
}

module.exports = PaymentModel;
