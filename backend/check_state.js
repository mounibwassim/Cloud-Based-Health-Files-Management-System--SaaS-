const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function checkState() {
    try {
        console.log("Checking State 19...");
        const res = await pool.query("SELECT id, code, name FROM states WHERE code = 19");
        console.table(res.rows);

        if (res.rows.length > 0) {
            const s = res.rows[0];
            if (s.id !== s.code) {
                console.log("MISMATCH DETECTED! ID != CODE");
                console.log(`Badge Query searches state_id=${s.code}`);
                console.log(`List Query searches state_id=${s.id}`);
            } else {
                console.log("ID matches Code. Mismatch must be elsewhere (User ID?).");
            }
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}
checkState();
