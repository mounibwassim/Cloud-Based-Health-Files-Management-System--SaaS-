const { Pool } = require('pg');
require('dotenv').config();

// Use the robust connection logic
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        console.log("Adding 'last_login' to users table...");
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
        `);
        console.log("✅ Success: Column added.");
    } catch (err) {
        console.error("❌ Migration Failed:", err.message);
    } finally {
        pool.end();
    }
}

migrate();
