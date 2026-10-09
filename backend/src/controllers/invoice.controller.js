const InvoiceModel = require('../models/invoice.model');

// GET /api/invoices — List invoices (with search, payment_status, pagination)
const getInvoices = async (req, res, next) => {
  try {
    const { search, payment_status, page = 1, limit } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offset = limitNum ? (pageNum - 1) * limitNum : undefined;

    const { rows, total } = await InvoiceModel.findAll({
      search,
      payment_status,
      limit: limitNum,
      offset,
    });

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

// GET /api/invoices/:id — Get invoice detail by ID
const getInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const invoice = await InvoiceModel.findById(id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.status(200).json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

// POST /api/invoices — Create invoice from order
const createInvoiceFromOrder = async (req, res, next) => {
  try {
    const { order_id, due_days = 30, notes } = req.body;

    if (!order_id) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: ['order_id is required'],
      });
    }

    const newInvoice = await InvoiceModel.createFromOrder({
      order_id,
      due_days,
      notes,
    });

    res.status(201).json({ success: true, data: newInvoice });
  } catch (err) {
    if (err.message && (err.message.includes('not found') || err.message.includes('already exists'))) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
};

// PUT /api/invoices/:id/status — Update invoice payment status
const updateInvoiceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    if (!payment_status || payment_status.trim() === '') {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: ['payment_status is required'],
      });
    }

    const existing = await InvoiceModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const updatedInvoice = await InvoiceModel.updatePaymentStatus(id, payment_status.trim());
    res.status(200).json({ success: true, data: updatedInvoice });
  } catch (err) {
    if (err.message && err.message.includes('Invalid payment status')) {
      return res.status(422).json({ success: false, message: err.message });
    }
    next(err);
  }
};

// POST /api/invoices/:id/sync-status — Sync payment_status base on actual payments recorded
const syncInvoiceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedInvoice = await InvoiceModel.recalculatePaymentStatus(id);

    if (!updatedInvoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Invoice status synchronized with payment total',
      data: updatedInvoice,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/invoices/:id — Delete invoice and associated payments
const deleteInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await InvoiceModel.delete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.status(200).json({
      success: true,
      message: `Invoice #${deleted.invoice_number} deleted successfully`,
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoiceFromOrder,
  updateInvoiceStatus,
  syncInvoiceStatus,
  deleteInvoice,
};
