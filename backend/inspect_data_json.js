const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function inspectRecords() {
    try {
        console.log("--- Records (Latest 5) ---");
        const res = await pool.query(`
            SELECT id, employee_name, user_id
            FROM records 
            ORDER BY created_at DESC 
            LIMIT 5
        `);
        console.log(JSON.stringify(res.rows, null, 2));

        console.log("--- Users ---");
        const users = await pool.query('SELECT id, username FROM users');
        console.log(JSON.stringify(users.rows, null, 2));

    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}
inspectRecords();
