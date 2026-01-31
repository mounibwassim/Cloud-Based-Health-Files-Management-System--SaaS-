const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        console.log('Connecting to Neon Database...');

        // Read Schema
        const schemaPath = path.resolve(__dirname, '../../deployment/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running Schema Migration...');
        await pool.query(schemaSql);
        console.log('Schema applied successfully.');

        // Read Seeds
        const seedPath = path.resolve(__dirname, '../../deployment/seed.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        console.log('Running Data Seeding...');
        // Split seed file by semicolon if needed, but PG driver usually handles multiple statements
        // if they are simple inserts.
        await pool.query(seedSql);
        console.log('Seeding completed successfully.');

    } catch (err) {
        console.error('Migration Failed:', err);
    } finally {
        await pool.end();
    }
}

migrate();
