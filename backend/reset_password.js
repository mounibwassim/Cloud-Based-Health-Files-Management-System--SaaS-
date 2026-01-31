const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function reset() {
    try {
        const username = 'wassim';
        const password = 'wassim';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Update or Insert
        const res = await pool.query(`
            INSERT INTO users (username, password_hash, role)
            VALUES ($1, $2, 'user')
            ON CONFLICT (username) 
            DO UPDATE SET password_hash = $2
            RETURNING id, username;
        `, [username, hash]);

        console.log("Reset successful for:", res.rows[0]);
    } catch (err) {
        console.error("Reset Error:", err);
    } finally {
        pool.end();
    }
}

reset();
