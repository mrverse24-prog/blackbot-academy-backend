const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');

router.get('/', getAllCourses);
router.get('/:courseId', getCourseById);
router.post('/', authMiddleware, adminCheck, createCourse);
router.put('/:courseId', authMiddleware, adminCheck, updateCourse);
router.delete('/:courseId', authMiddleware, adminCheck, deleteCourse);

module.exports = router;