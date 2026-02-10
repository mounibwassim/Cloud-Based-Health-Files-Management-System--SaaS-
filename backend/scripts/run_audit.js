const pool = require('../db');
const fs = require('fs');
const path = require('path');

const runAudit = async () => {
    try {
        console.log("🚨 STARTING EMERGENCY AUDIT...");

        const sqlPath = path.join(__dirname, '../../deployment/backfill_serials.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log("Executing SQL...");
        await pool.query(sql);

        console.log("✅ Database Audit & Flattening Complete.");
        process.exit(0);

    } catch (err) {
        console.error("❌ Audit Failed:", err);
        process.exit(1);
    }
};

runAudit();
