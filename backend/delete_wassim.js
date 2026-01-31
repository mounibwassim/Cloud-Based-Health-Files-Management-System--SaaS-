const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'healthfiles_dz',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

async function deleteWassim() {
    try {
        console.log("Deleting user 'wassim'...");
        await pool.query("DELETE FROM users WHERE username = 'wassim'");
        console.log("Deleted.");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}
deleteWassim();
