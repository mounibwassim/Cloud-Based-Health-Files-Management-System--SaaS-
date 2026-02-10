
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log("--- Altering STATES Table: code -> VARCHAR ---");
        // We need to alter column type. Since current values are integers, they cast automatically to varchar.
        await pool.query("ALTER TABLE states ALTER COLUMN code TYPE VARCHAR(10)");
        console.log("✅ Successfully changed 'code' to VARCHAR(10).");

    } catch (err) {
        console.error("Alter Table Error:", err);
    } finally {
        pool.end();
    }
}

run();
