const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId, isAdmin = false) => {
  return jwt.sign(
    { userId, isAdmin },
    process.env.railwayJWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.railwayJWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
