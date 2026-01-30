const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000,
});

async function checkConnection() {
    console.log('Testing connection to:', process.env.DATABASE_URL);
    try {
        await client.connect();
        console.log('✅ Connection Successful!');
        const res = await client.query('SELECT NOW()');
        console.log('Database Time:', res.rows[0].now);
        await client.end();
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed.');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);

        if (err.code === 'ECONNREFUSED') {
            console.log('\nSuggested Fix: Is the PostgreSQL service running? Check port 5432.');
        } else if (err.code === '28P01') {
            console.log('\nSuggested Fix: Authentication failed. Check username/password in .env file.');
        } else if (err.code === '3D000') {
            console.log('\nSuggested Fix: Database "health_files_db" does not exist. Create it using pgAdmin or psql.');
        }

        await client.end();
        process.exit(1);
    }
}

checkConnection();
