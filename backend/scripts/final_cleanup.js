const pool = require('../db');

const cleanup = async () => {
    try {
        console.log("🧹 Running Final Cleanup...");

        // 1. Drop manager_id columns
        await pool.query('ALTER TABLE users DROP COLUMN IF EXISTS manager_id');
        await pool.query('ALTER TABLE records DROP COLUMN IF EXISTS manager_id');
        console.log("✅ Dropped manager_id columns");

        // 2. Ensure user_id is Integer (fixes the syntax error issue if column type was wrong)
        await pool.query('ALTER TABLE records ALTER COLUMN user_id TYPE INTEGER USING (user_id::integer)');
        console.log("✅ Enforced INTEGER type on records.user_id");

        console.log("🎉 Cleanup Complete!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Cleanup Failed:", err);
        process.exit(1);
    }
};

cleanup();
