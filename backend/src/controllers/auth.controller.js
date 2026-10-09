const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../middleware/auth.middleware');

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const errors = [];
    if (!email || email.trim() === '') errors.push('Email is required');
    if (!password) errors.push('Password is required');

    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    const user = await UserModel.findByEmail(email.trim());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (user.is_active === false) {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda telah dinonaktifkan. Silakan hubungi administrator.',
      });
    }

    const isMatch = await UserModel.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me (Get Current Admin Profile)
const getMe = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  getMe,
};
