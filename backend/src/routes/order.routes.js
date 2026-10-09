const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
} = require('../controllers/order.controller');

// Endpoints
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id/status', updateOrderStatus);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
