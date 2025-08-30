


const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simple API endpoint for testing
app.get('/api', (req, res) => {
  res.json({ message: 'Test server is running!' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 56461;
console.log(`Starting test server on port ${PORT}`);

try {
  const server = app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
  });

  // Export the server instance for testing
  module.exports.server = server;

} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}


