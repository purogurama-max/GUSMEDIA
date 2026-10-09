const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoiceById,
  createInvoiceFromOrder,
  updateInvoiceStatus,
  syncInvoiceStatus,
  deleteInvoice,
} = require('../controllers/invoice.controller');

// Endpoints
router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.post('/', createInvoiceFromOrder);
router.put('/:id/status', updateInvoiceStatus);
router.post('/:id/sync-status', syncInvoiceStatus);
router.delete('/:id', deleteInvoice);

module.exports = router;
