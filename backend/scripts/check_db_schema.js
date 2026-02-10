
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log("--- Checking STATES Table Schema ---");
        const res = await pool.query("SELECT data_type FROM information_schema.columns WHERE table_name = 'states' AND column_name = 'code'");
        console.log("CODE COLUMN TYPE:", res.rows[0]?.data_type);
    } catch (err) {
        console.error("Schema Check Error:", err);
    } finally {
        pool.end();
    }
}

run();
