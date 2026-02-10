const pool = require('../db');

const fix = async () => {
    try {
        console.log("🛠️ Fixing Schema for 2-Tier Hierarchy...");

        // 1. Remove old columns if they exist
        await pool.query('ALTER TABLE users DROP COLUMN IF EXISTS manager_id');
        await pool.query('ALTER TABLE records DROP COLUMN IF EXISTS manager_id');
        console.log("✅ Removed manager_id columns");

        // 2. Add user_id to records if missing
        await pool.query('ALTER TABLE records ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id)');
        console.log("✅ Added user_id column to records");

        console.log("🎉 Schema Fixed!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Fix Failed:", err);
        process.exit(1);
    }
};

fix();
