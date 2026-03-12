const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');
const { getLessonsByCourse, getLessonById, createLesson, updateLesson, deleteLesson } = require('../controllers/lessonController');

router.get('/course/:courseId', getLessonsByCourse);
router.get('/:lessonId', getLessonById);
router.post('/', authMiddleware, adminCheck, createLesson);
router.put('/:lessonId', authMiddleware, adminCheck, updateLesson);
router.delete('/:lessonId', authMiddleware, adminCheck, deleteLesson);

module.exports = router;