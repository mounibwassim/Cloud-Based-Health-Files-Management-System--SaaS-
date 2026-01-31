const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_l8iBAWwUe7mN@ep-shiny-silence-agxmeefo-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    console.log('Starting migration...');
    try {
        console.log('Adding status column to records table...');
        await pool.query("ALTER TABLE records ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'completed';");
        console.log('Success: Column added or already exists.');
    } catch (err) {
        console.error('Migration Failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
        console.log('Migration finished.');
    }
}

migrate();
