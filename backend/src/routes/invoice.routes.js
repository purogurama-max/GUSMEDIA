const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoiceById,
  createInvoiceFromOrder,
  updateInvoiceStatus,
} = require('../controllers/invoice.controller');

// Endpoints
router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.post('/', createInvoiceFromOrder);
router.put('/:id/status', updateInvoiceStatus);

module.exports = router;
