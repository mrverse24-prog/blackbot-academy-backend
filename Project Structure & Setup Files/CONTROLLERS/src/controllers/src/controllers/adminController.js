const pool = require('../config/database');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
    const premiumUsers = await pool.query('SELECT COUNT(*) FROM users WHERE is_premium = true');
    const totalRevenue = await pool.query('SELECT SUM(amount) FROM payments WHERE payment_status = $1', ['completed']);
    const totalLessons = await pool.query('SELECT COUNT(*) FROM lessons');

    res.json({
      totalUsers: totalUsers.rows[0].count,
      premiumUsers: premiumUsers.rows[0].count,
      totalRevenue: totalRevenue.rows[0].sum || 0,
      totalLessons: totalLessons.rows[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, username, is_premium, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT p.*, u.email, u.username FROM payments p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboardStats, getAllUsers, getPaymentHistory };