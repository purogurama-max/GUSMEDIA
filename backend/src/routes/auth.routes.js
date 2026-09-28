const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Public route
router.post('/login', login);

// Protected route
router.get('/me', verifyToken, getMe);

module.exports = router;
