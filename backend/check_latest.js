const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function checkLatest() {
    try {
        console.log("--- Latest Record ---");
        const res = await pool.query(`
            SELECT id, employee_name, user_id, created_at 
            FROM records 
            ORDER BY created_at DESC 
            LIMIT 1
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}
checkLatest();
