
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log("--- Updating Wilaya 16 (Alger) ---");

        // 1. Check current state
        const check = await pool.query("SELECT * FROM states WHERE code LIKE '16%' ORDER BY code");
        console.log("Current 16-series states:", check.rows.map(r => `${r.code}: ${r.name}`));

        // 2. Add New Sub-Wilayas if missing
        const newStates = [
            { code: '16-1', name: 'Alger Centre' }, // Assuming names, or just "Alger 16-1"? User said "Alger centre 16-1"
            { code: '16-2', name: 'Alger East' },
            { code: '16-3', name: 'Alger West' }
        ];

        for (const s of newStates) {
            const exists = check.rows.find(r => r.code === s.code);
            if (!exists) {
                console.log(`Adding ${s.code} (${s.name})...`);
                await pool.query("INSERT INTO states (code, name) VALUES ($1, $2)", [s.code, s.name]);
            } else {
                console.log(`${s.code} already exists.`);
            }
        }

        // 3. Migrate Records from '16' to '16-1' (Default fallback) OR just delete?
        // User said "delete that". If records exist, they will be orphaned or violate FK if we delete state.
        // Let's check records first.
        const oldState = check.rows.find(r => r.code === '16');
        if (oldState) {
            const recordCount = await pool.query("SELECT COUNT(*) FROM records WHERE state_id = $1", [oldState.id]);
            console.log(`Records linked to '16': ${recordCount.rows[0].count}`);

            if (parseInt(recordCount.rows[0].count) > 0) {
                console.log("⚠️ WARNING: Records exist for Wilaya 16. Migrating them to 16-1 (Alger Centre) before deletion.");
                // Find ID of 16-1
                const newIdRes = await pool.query("SELECT id FROM states WHERE code = '16-1'");
                const newId = newIdRes.rows[0].id;
                await pool.query("UPDATE records SET state_id = $1 WHERE state_id = $2", [newId, oldState.id]);
                console.log("   Migrated records.");
            }

            // 4. Delete '16'
            console.log("Deleting Wilaya 16...");
            await pool.query("DELETE FROM states WHERE id = $1", [oldState.id]);
            console.log("✅ Wilaya 16 Deleted.");
        } else {
            console.log("Wilaya 16 not found (already deleted?).");
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}

run();
