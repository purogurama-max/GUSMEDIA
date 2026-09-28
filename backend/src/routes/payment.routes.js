const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPayments,
  getOutstanding,
  getPaymentHistory,
} = require('../controllers/payment.controller');

// Endpoints
router.get('/outstanding', getOutstanding);              // GET /api/payments/outstanding
router.get('/history/:invoiceId', getPaymentHistory);   // GET /api/payments/history/:invoiceId
router.get('/', getPayments);                            // GET /api/payments
router.post('/', createPayment);                         // POST /api/payments

module.exports = router;
