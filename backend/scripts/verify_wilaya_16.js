
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log("--- Verifying Wilaya 16 Status ---");
        const res = await pool.query("SELECT id, code, name FROM states WHERE code LIKE '16%' ORDER BY code");

        if (res.rows.length === 0) {
            console.log("No states found matching code '16%'");
        } else {
            console.table(res.rows);
        }

        // Check for records linked to '16'
        const oldState = res.rows.find(r => r.code === '16');
        if (oldState) {
            const countRes = await pool.query("SELECT COUNT(*) FROM records WHERE state_id = $1", [oldState.id]);
            console.log(`Records still linked to Wilaya 16 (ID: ${oldState.id}): ${countRes.rows[0].count}`);
        }

    } catch (err) {
        console.error("Verification Error:", err);
        if (err.position) console.error("Position:", err.position);
        if (err.detail) console.error("Detail:", err.detail);
        if (err.hint) console.error("Hint:", err.hint);
    } finally {
        pool.end();
    }
}

run();
