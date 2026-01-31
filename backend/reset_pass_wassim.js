const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function resetPass() {
    try {
        const password = 'wassim';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        console.log("Resetting password for 'wassim'...");
        await pool.query('UPDATE users SET password_hash = $1 WHERE username = $2', [hash, 'wassim']);
        console.log("Password reset to 'wassim'.");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}
resetPass();
