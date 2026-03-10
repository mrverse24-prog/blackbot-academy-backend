const express = require('express');
const router = express.Router();
const { verifyToken } = require('../config/jwt');
const { getDashboard, getAllUsers, getAllCourses, createCourse, getUserProgress } = require('../controllers/adminController');

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Protect all admin routes with token verification and admin check
router.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.use(checkAdmin);

// Admin routes
router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.get('/courses', getAllCourses);
router.post('/courses', createCourse);
router.get('/progress', getUserProgress);

module.exports = router;
