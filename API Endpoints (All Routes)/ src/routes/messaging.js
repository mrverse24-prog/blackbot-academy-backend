const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');
const { sendMessage, getMessages, respondToMessage, getAllMessages } = require('../controllers/messagingController');

router.post('/send', authMiddleware, sendMessage);
router.get('/my-messages', authMiddleware, getMessages);
router.put('/respond/:messageId', authMiddleware, adminCheck, respondToMessage);
router.get('/all', authMiddleware, adminCheck, getAllMessages);

module.exports = router;