const pool = require('../config/database');

// Get dashboard stats
const getDashboard = async (req, res) => {
  try {
    const userCount = await pool.query('SELECT COUNT(*) as total FROM users');
    const courseCount = await pool.query('SELECT COUNT(*) as total FROM courses');
    const enrollmentCount = await pool.query('SELECT COUNT(*) as total FROM enrollments');
    const premiumCount = await pool.query('SELECT COUNT(*) as total FROM users WHERE is_premium = true');

    res.json({
      totalUsers: parseInt(userCount.rows[0].total),
      totalCourses: parseInt(courseCount.rows[0].total),
      totalEnrollments: parseInt(enrollmentCount.rows[0].total),
      premiumUsers: parseInt(premiumCount.rows[0].total)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, username, first_name, last_name, is_premium, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, description, duration_hours, created_at FROM courses ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, duration_hours } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      'INSERT INTO courses (title, description, duration_hours) VALUES ($1, $2, $3) RETURNING *',
      [title, description, duration_hours]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user progress
const getUserProgress = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, u.email, u.username,
        c.id as course_id, c.title as course_title,
        COUNT(up.id) as lessons_completed,
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as total_lessons
      FROM users u
      LEFT JOIN enrollments e ON u.id = e.user_id
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN user_progress up ON u.id = up.user_id 
        AND up.lesson_id IN (SELECT id FROM lessons WHERE course_id = c.id)
      GROUP BY u.id, c.id
      ORDER BY u.id, c.id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboard, getAllUsers, getAllCourses, createCourse, getUserProgress };
