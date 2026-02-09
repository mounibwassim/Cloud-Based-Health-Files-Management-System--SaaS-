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
        // 1. Add reimbursement_amount to records
        await pool.query("ALTER TABLE records ADD COLUMN IF NOT EXISTS reimbursement_amount REAL");
        console.log("Column 'reimbursement_amount' added (or already exists) in 'records'.");
    } catch (err) {
        console.error("Error adding column:", err);
    } finally {
        await pool.end();
    }
}

run();
