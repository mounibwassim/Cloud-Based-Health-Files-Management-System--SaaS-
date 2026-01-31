const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function checkSchema() {
    try {
        console.log("Checking records table schema...");
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'records';
        `);
        console.log("Columns:", res.rows.map(r => r.column_name));

        const hasUserId = res.rows.some(r => r.column_name === 'user_id');
        console.log("Has user_id column?", hasUserId);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}
checkSchema();
