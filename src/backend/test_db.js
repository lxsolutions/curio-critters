





const { db } = require('./db');

console.log('Database connection successful');

// Test creating a user
try {
  const newUser = db.createUser('test_user', '3rd');
  console.log('Created user:', newUser);

  // Test getting the user back
  const retrievedUser = db.getUserByUsername('test_user');
  console.log('Retrieved user:', retrievedUser);
} catch (err) {
  console.error('Error testing database:', err);
}

db.close();


