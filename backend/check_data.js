const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: '127.0.0.1',
    database: process.env.DB_NAME || 'healthfiles_dz',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

async function checkData() {
    try {
        console.log("Checking DB Data...");
        const client = await pool.connect();

        const res = await client.query('SELECT COUNT(*) FROM states');
        console.log(`States Count: ${res.rows[0].count}`);

        const fileTypes = await client.query('SELECT COUNT(*) FROM file_types');
        console.log(`File Types Count: ${fileTypes.rows[0].count}`);

        client.release();
        process.exit(0);
    } catch (err) {
        console.error("Check Failed:", err);
        process.exit(1);
    }
}

checkData();
