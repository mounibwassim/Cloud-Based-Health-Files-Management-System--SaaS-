
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log("--- Checking Wilayas around 16 ---");
        const res = await pool.query(`
            SELECT code, name FROM states 
            WHERE CAST(SPLIT_PART(code, '-', 1) AS INTEGER) BETWEEN 14 AND 18
            ORDER BY CAST(SPLIT_PART(code, '-', 1) AS INTEGER), code ASC
        `);

        res.rows.forEach(r => {
            console.log(`${r.code}: ${r.name}`);
        });

        console.log("\n--- Checking for Forbidden Codes (161, 162, 163) ---");
        const resBad = await pool.query("SELECT * FROM states WHERE code IN ('161', '162', '163')");
        if (resBad.rowCount === 0) {
            console.log("✅ No incorrect codes found.");
        } else {
            console.log("❌ FOUND INCORRECT CODES:", resBad.rows.map(r => r.code));
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}

run();
