const pool = require('../config/database');

const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await pool.query('SELECT * FROM lessons WHERE course_id = $1 ORDER BY lesson_number ASC', [courseId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query('SELECT * FROM lessons WHERE id = $1', [lessonId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createLesson = async (req, res) => {
  try {
    const { courseId, title, description, lessonNumber, videoUrl, content, codeExample, difficulty } = req.body;
    const result = await pool.query(
      'INSERT INTO lessons (course_id, title, description, lesson_number, video_url, content, code_example, difficulty) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [courseId, title, description, lessonNumber, videoUrl, content, codeExample, difficulty]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title, description, videoUrl, content } = req.body;
    const result = await pool.query(
      'UPDATE lessons SET title = $1, description = $2, video_url = $3, content = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [title, description, videoUrl, content, lessonId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query('DELETE FROM lessons WHERE id = $1 RETURNING id', [lessonId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getLessonsByCourse, getLessonById, createLesson, updateLesson, deleteLesson };
