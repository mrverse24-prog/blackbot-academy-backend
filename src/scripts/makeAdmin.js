const pool = require('../config/database');

const makeAdmin = async () => {
  try {
    const result = await pool.query(
      'UPDATE users SET is_admin = true WHERE id = 4 RETURNING id, email, is_admin'
    );
    console.log('✓ User updated:', result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();
