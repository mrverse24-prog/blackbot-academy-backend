const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { generateToken } = require('../config/jwt');
require('dotenv').config();

// Register User
const registerUser = async (req, res) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, username, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username',
      [email, username, hashedPassword, firstName, lastName]
    );

    const token = generateToken(result.rows[0].id);

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is admin
    const isAdmin = user.email === process.env.ADMIN_EMAIL;

    const token = generateToken(user.id, isAdmin);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        isPremium: user.is_premium,
        isAdmin
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, username, first_name, last_name, profile_picture, is_premium, premium_courses, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };