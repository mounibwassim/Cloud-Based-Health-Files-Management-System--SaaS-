const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: '127.0.0.1',
    database: process.env.DB_NAME || 'healthfiles_dz',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

async function check() {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT COUNT(*) FROM states');
        console.log(`State Count: ${res.rows[0].count}`);

        const first = await client.query('SELECT * FROM states WHERE code = 1');
        console.log('State 1:', first.rows[0]);

        client.release();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
