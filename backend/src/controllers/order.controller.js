const OrderModel = require('../models/order.model');
const CustomerModel = require('../models/customer.model');

// GET /api/orders — List orders (with search, status, pagination)
const getOrders = async (req, res, next) => {
  try {
    const { search, status, customer_id, page = 1, limit } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offset = limitNum ? (pageNum - 1) * limitNum : undefined;

    const { rows, total } = await OrderModel.findAll({
      search,
      status,
      customer_id,
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

// GET /api/orders/:id — Get order detail by ID
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// POST /api/orders — Create new order
const createOrder = async (req, res, next) => {
  try {
    const { customer_id, items, discount = 0, tax = 0, notes = '' } = req.body;

    const errors = [];
    if (!customer_id) errors.push('Customer ID is required');
    if (!items || !Array.isArray(items) || items.length === 0) {
      errors.push('Order items array must contain at least one item');
    } else {
      items.forEach((item, index) => {
        if (!item.product_id) errors.push(`Item at index ${index} is missing product_id`);
        if (item.quantity === undefined || item.quantity <= 0) errors.push(`Item at index ${index} must have quantity > 0`);
      });
    }

    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    // Verify customer exists
    const customer = await CustomerModel.findById(customer_id);
    if (!customer) {
      return res.status(404).json({ success: false, message: `Customer with ID ${customer_id} not found` });
    }

    const newOrder = await OrderModel.createOrderWithItems({
      customer_id,
      items,
      discount,
      tax,
      notes,
    });

    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    if (err.message && err.message.includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};

// PUT /api/orders/:id/status — Update order status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || status.trim() === '') {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: ['Status is required'],
      });
    }

    const existing = await OrderModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updatedOrder = await OrderModel.updateStatus(id, status.trim());
    res.status(200).json({ success: true, data: updatedOrder });
  } catch (err) {
    if (err.message && err.message.includes('Invalid status')) {
      return res.status(422).json({ success: false, message: err.message });
    }
    next(err);
  }
};

// PUT /api/orders/:id — Update order (items, price, discount, tax, notes)
const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await OrderModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updatedOrder = await OrderModel.updateOrder(id, req.body);
    res.status(200).json({ success: true, data: updatedOrder });
  } catch (err) {
    if (err.message && err.message.includes('invoice')) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
};

// DELETE /api/orders/:id — Delete order
const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await OrderModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await OrderModel.deleteOrder(id);
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    if (err.message && err.message.includes('invoice')) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
};
