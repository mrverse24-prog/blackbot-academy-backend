const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-this';

router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO users (email, password, first_name, last_name, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, email, first_name, last_name, is_admin',
      [email, hashedPassword, firstName, lastName]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, isAdmin: user.is_admin }, SECRET_KEY);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, isAdmin: user.is_admin }, SECRET_KEY);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;
