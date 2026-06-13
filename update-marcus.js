const Database = require('better-sqlite3');
const db = new Database('./data/afzinc.db');
db.prepare("UPDATE team_cards SET image_url = '/images/team/marcus_zou.png' WHERE name LIKE '%Marcus%'").run();
console.log('Database updated!');
