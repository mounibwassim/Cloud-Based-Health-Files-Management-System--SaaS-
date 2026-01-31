const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

// Determine mode: PostgreSQL (Prod) vs SQLite (Dev)
const isPostgres = !!process.env.DATABASE_URL;

let db;
let pgPool;

console.log('Database Mode:', isPostgres ? 'PostgreSQL' : 'SQLite');

if (isPostgres) {
    console.log('Connecting to PostgreSQL...');
    pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
} else {
    // Only require sqlite3 if we are actually using it
    // This prevents crashes on systems where sqlite3 fails to build
    console.log('Using SQLite database (Local)');
    const sqlite3 = require('sqlite3').verbose();
    const dbPath = path.resolve(__dirname, 'health_files.sqlite');
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) console.error('Could not connect to SQLite database', err);
        else console.log('Connected to SQLite database at', dbPath);
    });
}

// Helper to standardise queries
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        if (isPostgres) {
            // Passthrough for PostgreSQL (Server.js now handles $1 syntax directly)
            pgPool.query(sql, params, (err, result) => {
                if (err) {
                    console.error('PG Error:', err.message, 'Query:', sql);
                    reject(err);
                } else {
                    resolve({
                        rows: result.rows,
                        rowCount: result.rowCount,
                        // Compatibility for legacy code accessing .lastID equivalent
                        // For INSERT RETURNING id, result.rows[0].id is the way.
                        // We map it here just in case.
                        lastID: result.rows.length > 0 ? result.rows[0].id : null
                    });
                }
            });
        } else {
            // SQLite Mode
            const method = sql.trim().toUpperCase().startsWith('SELECT') ? 'all' : 'run';
            db[method](sql, params, function (err, rows) {
                if (err) {
                    console.error('SQL Error:', err.message, 'Query:', sql);
                    reject(err);
                } else {
                    if (method === 'run') {
                        resolve({ rows: [], lastID: this.lastID, changes: this.changes });
                    } else {
                        resolve({ rows: rows });
                    }
                }
            });
        }
    });
}

module.exports = { query, db, pgPool };
