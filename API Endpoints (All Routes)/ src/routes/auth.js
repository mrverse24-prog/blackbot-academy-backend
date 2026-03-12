const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;