





const { createUser, getUserByUsername } = require('./db');

console.log('Database connection successful');

// Test creating a user
try {
  const newUser = createUser('test_user', '3rd');
  console.log('Created user:', newUser);

  // Test getting the user back
  const retrievedUser = getUserByUsername('test_user');
  console.log('Retrieved user:', retrievedUser);
} catch (err) {
  console.error('Error testing database:', err);
}

// Close the database connection if needed
if (require('./db').db.close) {
  require('./db').db.close();
}



