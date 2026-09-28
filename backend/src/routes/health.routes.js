const express = require('express');
const router = express.Router();

// GET /api/health - Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
