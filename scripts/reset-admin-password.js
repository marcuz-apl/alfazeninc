const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

// Resolve the db path relative to this script's directory
const dbPath = path.resolve(__dirname, '../data/smb4all.db');
const db = new Database(dbPath);

const defaultPass = 'admin123';
const hashedPass = crypto.createHash('sha256').update(defaultPass).digest('hex');

db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_password', ?)").run(hashedPass);
db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('password_changed', '0')").run();

console.log("Admin password reset to: admin123");
