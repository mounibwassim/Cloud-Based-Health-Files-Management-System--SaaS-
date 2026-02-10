const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true,
        sslmode: 'verify-full'
    }
});

async function migrate() {
    try {
        console.log("Checking for 'created_by_id' column in 'users' table...");

        // Check if column exists
        const checkRes = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='created_by_id';
        `);

        if (checkRes.rows.length === 0) {
            console.log("Adding 'created_by_id' column...");
            await pool.query(`ALTER TABLE users ADD COLUMN created_by_id INTEGER REFERENCES users(id);`);
            console.log("✅ Column 'created_by_id' added successfully.");
        } else {
            console.log("ℹ️ Column 'created_by_id' already exists.");
        }

    } catch (err) {
        console.error("❌ Migration failed:", err);
    } finally {
        pool.end();
    }
}

migrate();
