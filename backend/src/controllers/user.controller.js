const UserModel = require('../models/user.model');

// GET /api/users
const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.findAll();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/users
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'ADMIN', is_active = true } = req.body;

    const errors = [];
    if (!name || name.trim() === '') errors.push('Nama wajib diisi');
    if (!email || email.trim() === '') errors.push('Email wajib diisi');
    if (!password || password.length < 6) errors.push('Password minimal 6 karakter');

    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        message: errors.join(', '),
      });
    }

    const existingUser = await UserModel.findByEmail(email.trim());
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar. Gunakan email lain.',
      });
    }

    const newUser = await UserModel.create({
      name: name.trim(),
      email: email.trim(),
      password,
      role: role.toUpperCase(),
      is_active: is_active === true || is_active === 'true',
    });

    res.status(201).json({
      success: true,
      message: 'User berhasil ditambahkan',
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/:id/status
const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active === 'undefined') {
      return res.status(422).json({
        success: false,
        message: 'Status is_active wajib dikirim',
      });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    const updatedUser = await UserModel.updateStatus(id, Boolean(is_active));

    res.status(200).json({
      success: true,
      message: `Status user berhasil diubah menjadi ${is_active ? 'Aktif' : 'Nonaktif'}`,
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    if (password && password.length < 6) {
      return res.status(422).json({
        success: false,
        message: 'Password baru minimal 6 karakter',
      });
    }

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser && existingUser.id !== parseInt(id, 10)) {
        return res.status(400).json({
          success: false,
          message: 'Email sudah digunakan oleh user lain',
        });
      }
    }

    const updatedUser = await UserModel.updateUser(id, {
      name: name ? name.trim() : user.name,
      email: email ? email.trim() : user.email,
      role: role ? role.toUpperCase() : user.role,
      password,
    });

    res.status(200).json({
      success: true,
      message: 'Data user / password berhasil diperbarui',
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (parseInt(id, 10) === parseInt(req.user.id, 10)) {
      return res.status(400).json({
        success: false,
        message: 'Anda tidak dapat menghapus akun Anda sendiri.',
      });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    await UserModel.delete(id);

    res.status(200).json({
      success: true,
      message: 'User berhasil dihapus',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUserStatus,
  updateUser,
  deleteUser,
};
