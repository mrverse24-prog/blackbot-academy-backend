const pool = require('../config/database');

const addAdminColumn = async () => {
  try {
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN is_admin BOOLEAN DEFAULT false
    `);
    console.log('✓ is_admin column added to users table');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

addAdminColumn();
