import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Ensure the data directory exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Connect to the database file in the data folder
const dbPath = path.resolve(dataDir, 'afzinc.db');
const db = new Database(dbPath);

// Initialize the table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Initialize the admin settings table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`);

// Check and initialize default admin credentials if not set
const hasPassword = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_password'").get();
if (!hasPassword) {
  const defaultPass = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPass = crypto.createHash('sha256').update(defaultPass).digest('hex');
  
  db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_password', ?)")
    .run(hashedPass);
  
  db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('password_changed', '0')")
    .run();
}

export default db;
