const CustomerModel = require('../models/customer.model');

// Helper for email validation
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// GET /api/customers — Get all customers (with filter & pagination)
const getCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offset = limitNum ? (pageNum - 1) * limitNum : undefined;

    const { rows, total } = await CustomerModel.findAll({
      search,
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

// GET /api/customers/:id — Get customer by ID
const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await CustomerModel.findById(id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.status(200).json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
};

// POST /api/customers — Create customer
const createCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, company, address } = req.body;

    const errors = [];
    if (!name || name.trim() === '') errors.push('Customer name is required');
    if (!email || email.trim() === '') errors.push('Email is required');
    if (email && !isValidEmail(email.trim())) errors.push('Invalid email format');

    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    // Check duplicate email
    const existing = await CustomerModel.findByEmail(email.trim());
    if (existing) {
      return res.status(409).json({ success: false, message: 'A customer with this email already exists' });
    }

    const customer = await CustomerModel.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      company: company ? company.trim() : null,
      address: address ? address.trim() : null,
    });

    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
};

// PUT /api/customers/:id — Update customer
const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, address } = req.body;

    const existing = await CustomerModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Validate email if provided
    if (email && !isValidEmail(email.trim())) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: ['Invalid email format'],
      });
    }

    // Check email uniqueness if changed
    if (email && email.trim().toLowerCase() !== existing.email.toLowerCase()) {
      const emailExists = await CustomerModel.findByEmail(email.trim());
      if (emailExists && emailExists.id !== parseInt(id, 10)) {
        return res.status(409).json({ success: false, message: 'A customer with this email already exists' });
      }
    }

    const customer = await CustomerModel.update(id, {
      name: name ? name.trim() : undefined,
      email: email ? email.trim().toLowerCase() : undefined,
      phone: phone !== undefined ? (phone ? phone.trim() : null) : undefined,
      company: company !== undefined ? (company ? company.trim() : null) : undefined,
      address: address !== undefined ? (address ? address.trim() : null) : undefined,
    });

    res.status(200).json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/customers/:id — Delete customer
const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await CustomerModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await CustomerModel.delete(id);
    res.status(200).json({ success: true, message: 'Customer deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
