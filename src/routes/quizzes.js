const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');
const { getQuizByLesson, submitQuiz, createQuiz } = require('../controllers/quizController');

router.get('/lesson/:lessonId', getQuizByLesson);
router.post('/submit', authMiddleware, submitQuiz);
router.post('/', authMiddleware, adminCheck, createQuiz);

module.exports = router;
