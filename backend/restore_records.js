const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function restoreRecords() {
    try {
        console.log("Restoring records for 'wassim'...");

        // 1. Get User ID
        const userRes = await pool.query("SELECT id FROM users WHERE username = 'wassim'");
        if (userRes.rows.length === 0) {
            console.log("User 'wassim' not found.");
            return;
        }
        const userId = userRes.rows[0].id;
        console.log("Found User ID:", userId);

        // 2. Count Orphans
        const orphans = await pool.query("SELECT COUNT(*) FROM records WHERE user_id IS NULL");
        console.log("Orphaned Records (NULL user_id):", orphans.rows[0].count);

        // 3. Update Orphans
        const update = await pool.query("UPDATE records SET user_id = $1 WHERE user_id IS NULL", [userId]);
        console.log(`Updated ${update.rowCount} records to belong to User ${userId}.`);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}
restoreRecords();
