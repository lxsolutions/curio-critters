



const sqlite3 = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'curio_critters.db');
const db = new sqlite3(dbPath);

console.log('Database tables:');
db.prepare('SELECT name FROM sqlite_master WHERE type="table"').all().forEach(table => {
  console.log(`- ${table.name}`);
});

db.close();

