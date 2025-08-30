


const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { db } = require('./db');

// Check if we can use SQLite (for local development)
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('sqlite')) {
  console.log('Using SQLite for local development');
} else {
  // For production PostgreSQL, install pg dependency
  try {
    require('pg');
  } catch (e) {
    console.warn('PostgreSQL not available, falling back to SQLite');
  }
}

// Routes
const { router: authRoutes, authenticateJWT } = require('./routes/auth');
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// SQLite-based routes
const critterRoutes = require('./routes/critters');
const questRoutes = require('./routes/quests');

// For local development with SQLite, use these routes
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/critters', critterRoutes);
// Also register quests route for SQLite mode
app.use('/api/quests', questRoutes);

// MongoDB-based routes (temporarily disabled for SQLite mode)
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('sqlite')) {
  console.log('MongoDB routes disabled - using SQLite only');
} else {
  app.use('/api/auth', authRoutes);
  const questRoutes = require('./routes/quests');
  app.use('/api/quests', questRoutes);
  const analyticsRoutes = require('./routes/analytics');
  app.use('/api/analytics', analyticsRoutes);
}
// WebSocket setup for co-op modes
const { Server } = require('ws');
let wss;

function initWebSockets(server) {
  wss = new Server({ server });

  // Store active quests by room ID
  const activeQuests = {};

  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'joinQuest') {
          // Handle quest joining logic
        } else if (data.type === 'questUpdate') {
          // Broadcast updates to other players in the same quest
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
}

// Start server
const PORT = process.env.PORT || 56457; // Force different port to avoid conflicts

try {
  const serverInstance = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Initialize WebSocket server after HTTP server is listening
    initWebSockets(serverInstance);
  });

  // Export the server instance for testing
  module.exports.server = serverInstance;
} catch (error) {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please choose a different port.`);
    process.exit(1);
  } else {
    throw error;
  }
}

// Export wss for testing and other modules
module.exports.wss = wss;

