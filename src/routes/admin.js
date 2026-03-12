const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');
const { getDashboardStats, getAllUsers, getPaymentHistory } = require('../controllers/adminController');

router.get('/stats', authMiddleware, adminCheck, getDashboardStats);
router.get('/users', authMiddleware, adminCheck, getAllUsers);
router.get('/payments', authMiddleware, adminCheck, getPaymentHistory);

module.exports = router;
