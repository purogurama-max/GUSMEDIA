const PaymentModel = require('../models/payment.model');

// POST /api/payments — Record a new payment
const createPayment = async (req, res, next) => {
  try {
    const { invoice_id, amount, payment_method, payment_date, notes } = req.body;

    const errors = [];
    if (!invoice_id) errors.push('invoice_id is required');
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)
      errors.push('amount must be a positive number');
    if (!payment_method) errors.push('payment_method is required');

    if (errors.length > 0) {
      return res.status(422).json({ success: false, message: 'Validation error', errors });
    }

    const payment = await PaymentModel.create({
      invoice_id,
      amount,
      payment_method,
      payment_date,
      notes,
    });

    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    if (err.message && (err.message.includes('not found') || err.message.includes('Invalid payment_method'))) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
};

// GET /api/payments — List all payments (optionally filtered by invoice_id)
const getPayments = async (req, res, next) => {
  try {
    const { invoice_id, page = 1, limit } = req.query;

    const { rows, total } = await PaymentModel.findAll({ invoice_id, page, limit });
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = limit ? parseInt(limit, 10) : undefined;

    res.status(200).json({
      success: true,
      data: rows,
      meta: {
        total,
        page: pageNum,
        limit: limitNum || total,
        totalPages: limitNum ? Math.ceil(total / limitNum) : 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/payments/outstanding — Get all outstanding invoices
const getOutstanding = async (req, res, next) => {
  try {
    const rows = await PaymentModel.getOutstanding();
    res.status(200).json({ success: true, data: rows, meta: { total: rows.length } });
  } catch (err) {
    next(err);
  }
};

// GET /api/payments/history/:invoiceId — Get payment history for an invoice
const getPaymentHistory = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const history = await PaymentModel.getHistoryByInvoice(invoiceId);

    if (!history) {
      return res.status(404).json({ success: false, message: `Invoice with ID ${invoiceId} not found` });
    }

    res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPayment,
  getPayments,
  getOutstanding,
  getPaymentHistory,
};
