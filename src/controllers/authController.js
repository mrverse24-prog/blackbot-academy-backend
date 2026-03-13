const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { generateToken } = require('../config/jwt');
require('dotenv').config();

const registerUser = async (req, res) => {
  try {
    let { email, username, password, firstName, lastName } = req.body;
    
    if (!username) {
      username = email.split('@')[0];
    }
    
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (existingUser.rows.length > 0) return res.status(400).json({ error: 'User exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, username, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username',
      [email, username, hashedPassword, firstName, lastName]
    );
    
    const token = generateToken(result.rows[0].id, false);
    res.status(201).json({ message: 'Registered', user: result.rows[0], token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid' });
    
    const user = result.rows[0];
    console.log('User from DB:', user);
    console.log('is_admin value:', user.is_admin);
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid' });
    
    console.log('Generating token with isAdmin:', user.is_admin);
    const token = generateToken(user.id, user.is_admin);
    
    res.json({ token, user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, isAdmin: user.is_admin } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, username, first_name, last_name, is_premium, is_admin FROM users WHERE id = $1', [req.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
