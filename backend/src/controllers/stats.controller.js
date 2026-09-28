const db = require('../config/db');

// GET /api/stats — Aggregate dashboard statistics
const getStats = async (req, res, next) => {
  try {
    // Run all queries in parallel for performance
    const [
      revenueRes,
      ordersRes,
      customersRes,
      productsRes,
      pendingRes,
      completedRes,
      outstandingRes,
    ] = await Promise.all([
      // Total Revenue (from COMPLETED orders)
      db.query(
        `SELECT COALESCE(SUM(grand_total), 0) AS total_revenue FROM orders WHERE status = 'COMPLETED'`
      ),
      // Total Orders
      db.query(`SELECT COUNT(*) AS total_orders FROM orders`),
      // Total Customers
      db.query(`SELECT COUNT(*) AS total_customers FROM customers`),
      // Total Active Products
      db.query(`SELECT COUNT(*) AS total_products FROM products WHERE status = 'ACTIVE'`),
      // Pending Orders count
      db.query(`SELECT COUNT(*) AS pending_orders FROM orders WHERE status = 'PENDING'`),
      // Completed Orders count
      db.query(`SELECT COUNT(*) AS completed_orders FROM orders WHERE status = 'COMPLETED'`),
      // Total Outstanding (sum of unpaid/partial invoices grand_total minus paid)
      db.query(`
        SELECT COALESCE(SUM(
          i.grand_total - COALESCE(
            (SELECT SUM(p.amount) FROM payments p WHERE p.invoice_id = i.id AND p.status = 'PAID'),
            0
          )
        ), 0) AS total_outstanding
        FROM invoices i
        WHERE i.payment_status != 'PAID'
      `),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total_revenue: parseFloat(revenueRes.rows[0].total_revenue),
        total_orders: parseInt(ordersRes.rows[0].total_orders, 10),
        total_customers: parseInt(customersRes.rows[0].total_customers, 10),
        total_products: parseInt(productsRes.rows[0].total_products, 10),
        pending_orders: parseInt(pendingRes.rows[0].pending_orders, 10),
        completed_orders: parseInt(completedRes.rows[0].completed_orders, 10),
        total_outstanding: parseFloat(outstandingRes.rows[0].total_outstanding),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
