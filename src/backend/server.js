

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/auth');
const questRoutes = require('./routes/quests');

const app = express();
app.use(cors());
app.use(express.json());

// Simple API endpoint for testing
app.get('/api', (req, res) => {
  res.json({ message: 'Curio Critters API is running!' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/quests', questRoutes);

// Start server
const PORT = process.env.PORT || 6002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

