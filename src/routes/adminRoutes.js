const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.get('/dashboard', authMiddleware, adminController.getDashboard);
router.get('/users', authMiddleware, adminController.getAllUsers);
router.get('/courses', authMiddleware, adminController.getAllCourses);
router.post('/courses', authMiddleware, adminController.createCourse);
router.get('/progress', authMiddleware, adminController.getUserProgress);

module.exports = router;
