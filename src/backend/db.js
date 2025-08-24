


const sqlite3 = require('better-sqlite3');
const path = require('path');

// Initialize database
const dbPath = path.join(__dirname, 'curio_critters.db');
const db = new sqlite3(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    grade TEXT,
    progress TEXT DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS learning_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    topic TEXT NOT NULL,
    score REAL NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS pet_care_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS quest_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    quest_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    score REAL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// Helper functions
function getUserByUsername(username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username);
}

function createUser(username, grade) {
  const stmt = db.prepare('INSERT INTO users (username, grade) VALUES (?, ?)');
  const info = stmt.run(username, grade || 'K-12');
  return getUserById(info.lastInsertRowid);
}

function getUserById(id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id);
}

function updateUserProgress(userId, progress) {
  const stmt = db.prepare('UPDATE users SET progress = ? WHERE id = ?');
  stmt.run(JSON.stringify(progress), userId);
}

function logLearningMetric(userId, topic, score) {
  const stmt = db.prepare('INSERT INTO learning_metrics (user_id, topic, score) VALUES (?, ?, ?)');
  stmt.run(userId, topic, score);
}

function getLearningMetricsForUser(userId) {
  const stmt = db.prepare(`
    SELECT topic, AVG(score) as average_score, COUNT(*) as attempts
    FROM learning_metrics
    WHERE user_id = ?
    GROUP BY topic
  `);
  return stmt.all(userId);
}

module.exports = {
  db,
  getUserByUsername,
  createUser,
  getUserById,
  updateUserProgress,
  logLearningMetric,
  getLearningMetricsForUser
};


