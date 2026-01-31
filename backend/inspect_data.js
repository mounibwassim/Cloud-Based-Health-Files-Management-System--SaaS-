const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function inspectRecords() {
    try {
        console.log("--- Inspecting Records ---");
        const res = await pool.query(`
            SELECT id, employee_name, user_id, created_at 
            FROM records 
            ORDER BY created_at DESC 
            LIMIT 10
        `);
        console.table(res.rows);

        console.log("--- Inspecting Users ---");
        const users = await pool.query('SELECT id, username FROM users');
        console.table(users.rows);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}
inspectRecords();
