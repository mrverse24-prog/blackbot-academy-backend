const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getUserCourseProgress, markLessonComplete, getOverallProgress } = require('../controllers/progressController');

router.get('/course/:courseId', authMiddleware, getUserCourseProgress);
router.post('/mark-complete', authMiddleware, markLessonComplete);
router.get('/overview/all', authMiddleware, getOverallProgress);

module.exports = router;
