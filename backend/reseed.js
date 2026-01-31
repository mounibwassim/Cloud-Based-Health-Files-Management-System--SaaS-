const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: 'localhost',
    database: process.env.DB_NAME || 'healthfiles_dz',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

async function reseed() {
    try {
        console.log("Reseeding Database...");
        const client = await pool.connect();

        const seedPath = path.join(__dirname, '../deployment/seed.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        // We run the seed SQL. It has ON CONFLICT DO NOTHING, so it's safe to run multiple times.
        await client.query(seedSql);

        console.log("Seed Completed Successfully.");
        client.release();
        process.exit(0);
    } catch (err) {
        console.error("Reseed Failed:", err);
        process.exit(1);
    }
}

reseed();
