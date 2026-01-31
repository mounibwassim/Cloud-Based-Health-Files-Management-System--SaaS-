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

async function checkUser() {
    try {
        console.log("Checking for user 'wassim'...");
        const res = await pool.query("SELECT * FROM users WHERE username = 'wassim'");
        if (res.rows.length === 0) {
            console.log("User 'wassim' NOT found. (Likely deleted)");
        } else {
            console.log("User 'wassim' FOUND. ID:", res.rows[0].id);
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}
checkUser();
