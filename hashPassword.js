const bcrypt = require('bcryptjs');

const password = 'password123';
bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Hashed password:', hashedPassword);
  }
});
