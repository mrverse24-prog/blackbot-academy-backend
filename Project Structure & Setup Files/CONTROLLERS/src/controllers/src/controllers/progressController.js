const pool = require('../config/database');

const getUserCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await pool.query(
      'SELECT up.*, l.title as lesson_title FROM user_progress up LEFT JOIN lessons l ON up.lesson_id = l.id WHERE up.user_id = $1 AND up.course_id = $2 ORDER BY up.created_at DESC',
      [req.userId, courseId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const result = await pool.query(
      'INSERT INTO user_progress (user_id, course_id, lesson_id, is_completed, completed_at) VALUES ($1, $2, $3, true, CURRENT_TIMESTAMP) RETURNING *',
      [req.userId, courseId, lessonId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOverallProgress = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT c.id, c.title, c.language, COUNT(DISTINCT l.id) as total_lessons, COUNT(DISTINCT CASE WHEN up.is_completed = true THEN up.lesson_id END) as completed_lessons FROM courses c LEFT JOIN lessons l ON c.id = l.course_id LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1 GROUP BY c.id, c.title, c.language',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserCourseProgress, markLessonComplete, getOverallProgress };