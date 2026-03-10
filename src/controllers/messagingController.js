const pool = require('../config/database');

const sendMessage = async (req, res) => {
  try {
    const { subject, messageContent } = req.body;
    const result = await pool.query(
      'INSERT INTO messages (user_id, subject, message_content) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, subject, messageContent]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at DESC', [req.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const respondToMessage = async (req, res) => {
  try {
    const { messageId, adminResponse } = req.body;
    const result = await pool.query(
      'UPDATE messages SET admin_response = $1, is_answered = true, admin_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [adminResponse, req.userId, messageId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const result = await pool.query('SELECT m.*, u.username, u.email FROM messages m JOIN users u ON m.user_id = u.id ORDER BY m.created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendMessage, getMessages, respondToMessage, getAllMessages };
