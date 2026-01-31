const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: '127.0.0.1', // Force IPv4
    database: process.env.DB_NAME || 'healthfiles_dz',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

async function runMigration() {
    try {
        console.log("Connecting to Database...");
        const client = await pool.connect();

        // fixed paths relative to backend execution
        const schemaPath = path.join(__dirname, '../deployment/schema.sql');
        const seedPath = path.join(__dirname, '../deployment/seed.sql');

        console.log("Reading Schema...");
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log("Applying Schema...");
        await client.query(schemaSql);
        console.log("Schema Applied Successfully.");

        console.log("Reading Seed...");
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        console.log("Applying Seed...");
        await client.query(seedSql);
        console.log("Seed Applied Successfully.");

        client.release();
        process.exit(0);
    } catch (err) {
        console.error("Migration Failed:", err);
        process.exit(1);
    }
}

runMigration();
