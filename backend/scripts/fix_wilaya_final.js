
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log("--- Wilaya Cleanup & Restore ---");

        // 1. Delete improper wilayas (161, 162, 163)
        const badCodes = ['161', '162', '163'];
        for (const code of badCodes) {
            const res = await pool.query("DELETE FROM states WHERE code = $1 RETURNING *", [code]);
            if (res.rowCount > 0) {
                console.log(`Deleted incorrect wilaya: ${code} (${res.rows[0].name})`);
            } else {
                console.log(`Wilaya ${code} not found (already deleted?)`);
            }
        }

        // 2. Restore Wilaya 16 (Alger)
        // Check if exists first to avoid duplicate key error
        const res16 = await pool.query("SELECT * FROM states WHERE code = '16'");
        if (res16.rowCount === 0) {
            console.log("Restoring Wilaya 16 (Alger)...");
            await pool.query("INSERT INTO states (code, name) VALUES ($1, $2)", ['16', 'Alger']);
            console.log("✅ Restored Wilaya 16.");
        } else {
            console.log("Wilaya 16 already exists.");
        }

        // 3. Verify Order
        console.log("\n--- Verification: Checking Order around 16 ---");
        const resSort = await pool.query(`
            SELECT code, name FROM states 
            WHERE code LIKE '1%' OR code LIKE '2%'
            ORDER BY CAST(SPLIT_PART(code, '-', 1) AS INTEGER), code ASC
        `);

        // Print usage to verify 15 -> 16 -> 16-1 ... -> 17
        const rows = resSort.rows;
        // find index of 15
        const start = rows.findIndex(r => r.code === '15');
        if (start !== -1) {
            // Show slice from 15 to ... 20? 
            const end = start + 10;
            console.table(rows.slice(start, end));
        } else {
            console.table(rows);
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}

run();
