const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../health_files.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // 2. Add manager_id to users
    db.run("ALTER TABLE users ADD COLUMN manager_id INTEGER REFERENCES users(id)", (err) => {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                console.log("Column 'manager_id' already exists in 'users'.");
            } else {
                console.error("Error adding column 'manager_id':", err.message);
            }
        } else {
            console.log("Column 'manager_id' added to 'users'.");
        }
    });
});

db.close();
