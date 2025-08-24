


const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Routes
const authRoutes = require('./routes/auth');
const questRoutes = require('./routes/quests');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection - use in-memory MongoDB for local development
let mongoServer;
(async () => {
  try {
    // Use MongoMemoryServer if no external MongoDB is available (for local dev)
    const mongoUri = process.env.MONGODB_URI;

    let dbConnection;
    if (mongoUri && !mongoUri.includes('localhost') && !mongoUri.includes('127.0.0.1')) {
      // Use provided URI for production/deployment
      dbConnection = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } else {
      // Use in-memory MongoDB for local development
      mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      dbConnection = await mongoose.connect(memoryUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    console.log('Database connected');
  } catch (err) {
    console.error('Database connection error:', err);
  }
})();

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'Curio Critters API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/quests', questRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

