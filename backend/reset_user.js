const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: '127.0.0.1',
    database: process.env.DB_NAME || 'healthfiles_dz',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

async function resetUser() {
    try {
        const username = 'mounib';
        const password = 'Mounib$7'; // The requested password

        console.log(`Resetting password for user: ${username}`);
        const client = await pool.connect();

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const query = `
            INSERT INTO users (username, password_hash, role)
            VALUES ($1, $2, 'admin')
            ON CONFLICT (username) 
            DO UPDATE SET password_hash = $2;
        `;

        await client.query(query, [username, hash]);
        console.log(`Success! User '${username}' can now login with '${password}'`);

        client.release();
        process.exit(0);
    } catch (err) {
        console.error("Reset Failed:", err);
        process.exit(1);
    }
}

resetUser();
