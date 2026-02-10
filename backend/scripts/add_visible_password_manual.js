const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function migrate() {
    try {
        console.log("Reading .env manually...");
        const envPath = path.resolve(__dirname, '../../.env');
        if (!fs.existsSync(envPath)) {
            console.error(".env file not found at:", envPath);
            process.exit(1);
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/DATABASE_URL=(.*)/);
        if (!match) {
            console.error("DATABASE_URL not found in .env");
            process.exit(1);
        }

        const connectionString = match[1].trim();
        console.log("Connecting to DB...");

        const pool = new Pool({
            connectionString: connectionString,
            ssl: { rejectUnauthorized: true, sslmode: 'verify-full' }
        });

        console.log("Adding visible_password column to users table...");

        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS visible_password TEXT;
        `);

        console.log("Column added successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
