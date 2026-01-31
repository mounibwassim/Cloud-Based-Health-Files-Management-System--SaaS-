const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        console.log('Adding status column to records table...');
        await pool.query("ALTER TABLE records ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'completed';");
        console.log('Success: Column added or already exists.');
    } catch (err) {
        console.error('Migration Failed:', err);
    } finally {
        await pool.end();
    }
}

migrate();
