
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log("--- Checking Wilaya 16 Existence ---");
        const res16 = await pool.query("SELECT * FROM states WHERE code = '16'");
        if (res16.rows.length > 0) {
            console.log("⚠️ WARNING: Wilaya 16 FOUND (ID: " + res16.rows[0].id + ")");
            // Auto-delete if found, as user requested it gone
            await pool.query("DELETE FROM states WHERE id = $1", [res16.rows[0].id]);
            console.log("   Deleted Wilaya 16.");
        } else {
            console.log("✅ Wilaya 16 not found.");
        }

        console.log("\n--- Verification of Sort Order (Top 20) ---");
        // Simulate the new sort logic
        const resSort = await pool.query(`
            SELECT code, name FROM states 
            ORDER BY CAST(SPLIT_PART(code, '-', 1) AS INTEGER), code ASC
            LIMIT 20
        `);
        console.table(resSort.rows);

    } catch (err) {
        console.error("Check Error:", err);
    } finally {
        pool.end();
    }
}

run();
