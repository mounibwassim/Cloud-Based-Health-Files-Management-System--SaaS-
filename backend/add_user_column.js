const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function migrate() {
    try {
        console.log("Adding user_id column to records table...");

        // 1. Add Column
        await pool.query(`
            ALTER TABLE records 
            ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
        `);

        // 2. Clear old data? Or assign to a default user?
        // User said "fix this", implying they want isolation. 
        // Best to just delete old "orphaned" records to avoid confusion, 
        // OR assign them to the owner.
        // Let's just leave them NULL for now, and the GET query will filter 'WHERE user_id = $1'.
        // So NULL records will disappear from views (effectively hidden).

        console.log("Column added successfully.");
    } catch (err) {
        console.error("Migration Error:", err);
    } finally {
        pool.end();
    }
}
migrate();
