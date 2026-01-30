const db = require('../db');

async function migrate() {
    try {
        console.log('Adding status column to records table...');
        // SQLite doesn't support IF NOT EXISTS for ADD COLUMN in older versions, 
        // but we can try catch it or just run it. 
        // Default to 'completed' for existing records.
        await new Promise((resolve, reject) => {
            db.db.run(`ALTER TABLE records ADD COLUMN status TEXT DEFAULT 'completed'`, (err) => {
                if (err) {
                    // If error contains "duplicate column name", it's fine
                    if (err.message.includes('duplicate column name')) {
                        console.log('Column already exists.');
                        resolve();
                    } else {
                        reject(err);
                    }
                } else {
                    console.log('Column added successfully.');
                    resolve();
                }
            });
        });

    } catch (err) {
        console.error('Migration failed:', err);
    }
}

migrate();
