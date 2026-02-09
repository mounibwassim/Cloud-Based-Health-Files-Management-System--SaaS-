const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function run() {
    try {
        console.log("Connecting to PostgreSQL...");
        // 2. Add manager_id to users
        await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS manager_id INTEGER REFERENCES users(id)");
        console.log("Column 'manager_id' added (or already exists) in 'users'.");
    } catch (err) {
        console.error("Error adding column:", err);
    } finally {
        await pool.end();
    }
}

run();
