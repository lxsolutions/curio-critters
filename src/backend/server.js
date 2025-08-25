

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { db } = require('./db');

// Routes
const { router: authRoutes, authenticateJWT } = require('./routes/auth');
const questRoutes = require('./routes/quests');
const userRoutes = require('./routes/users');
const progressRoutes = require('./routes/progress');
const analyticsRoutes = require('./routes/analytics');

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
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/analytics', analyticsRoutes);

// Start server
const PORT = process.env.PORT || 56456;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

