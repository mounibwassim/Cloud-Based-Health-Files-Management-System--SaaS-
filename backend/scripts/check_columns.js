const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Path to SQLite file
const dbPath = path.resolve(__dirname, '../health_files.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
    }
});

db.all("PRAGMA table_info(records);", [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log("Columns in 'records' table:");
    rows.forEach((row) => {
        console.log(`- ${row.name} (${row.type})`);
    });
    db.close();
});
