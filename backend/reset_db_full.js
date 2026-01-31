const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function resetDb() {
    try {
        console.log("💣 Nuking Database...");

        // 1. Drop Tables
        await pool.query(`
            DROP TABLE IF EXISTS records CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
            DROP TABLE IF EXISTS file_types CASCADE;
            DROP TABLE IF EXISTS states CASCADE;
        `);
        console.log("✅ Tables Dropped.");

        // 2. Read Schema
        const schemaPath = path.join(__dirname, '../deployment/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schemaSql);
        console.log("✅ Schema Applied.");

        // 3. Read Seed
        const seedPath = path.join(__dirname, '../deployment/seed.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await pool.query(seedSql);
        console.log("✅ Seed Data Applied.");

        // 4. Force Reset Admin User
        const bcrypt = require('bcrypt');
        const hash = await bcrypt.hash('Mounib$7', 10);
        await pool.query(`
            INSERT INTO users (username, password_hash, role)
            VALUES ('mounib', $1, 'admin')
            ON CONFLICT (username) DO UPDATE SET password_hash = $1
        `, [hash]);
        console.log("✅ Admin 'mounib' Reset.");

        console.log("🚀 DATABASE FULLY RESET!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Reset Failed:", err);
        process.exit(1);
    }
}

resetDb();
