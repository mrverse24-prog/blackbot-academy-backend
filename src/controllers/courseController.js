const pool = require('../config/database');

const getAllCourses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [courseId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, language, price, totalLessons } = req.body;
    const result = await pool.query(
      'INSERT INTO courses (title, description, language, price, total_lessons) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, language, price, totalLessons]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, price, totalLessons } = req.body;
    const result = await pool.query(
      'UPDATE courses SET title = $1, description = $2, price = $3, total_lessons = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [title, description, price, totalLessons, courseId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING id', [courseId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };
