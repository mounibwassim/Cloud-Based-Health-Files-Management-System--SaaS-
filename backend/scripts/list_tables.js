const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../health_files.sqlite');
const db = new sqlite3.Database(dbPath);

console.log(`Checking database at: ${dbPath}`);

db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, tables) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Tables:", tables.map(t => t.name));
    }
    db.close();
});
