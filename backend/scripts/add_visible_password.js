require('dotenv').config({ path: './.env' });
const db = require('../db');

async function migrate() {
    try {
        console.log("Adding visible_password column to users table...");

        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS visible_password TEXT;
        `);

        console.log("Column added successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
