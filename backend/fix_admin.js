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

async function fixAdmin() {
    try {
        console.log("Fixing Admin Account...");
        const client = await pool.connect();

        // 1. Generate REAL hash
        const password = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        console.log(`Generated valid hash for '${password}': ${hash}`);

        // 2. Update DB
        // We use UPSERT logic: Insert if not exists, otherwise Update
        const query = `
            INSERT INTO users (username, password_hash, role)
            VALUES ('admin', $1, 'admin')
            ON CONFLICT (username) 
            DO UPDATE SET password_hash = $1;
        `;

        await client.query(query, [hash]);
        console.log("Admin password successfully reset to 'admin123'");

        client.release();
        process.exit(0);
    } catch (err) {
        console.error("Fix Failed:", err);
        process.exit(1);
    }
}

fixAdmin();
