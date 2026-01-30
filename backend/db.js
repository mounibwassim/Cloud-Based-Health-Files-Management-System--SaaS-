const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.resolve(__dirname, 'health_files.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to SQLite database at', dbPath);
    }
});

// Helper to wrap sqlite3 in Promises (like pg)
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        // Determine if it's a SELECT (all) or INSERT/UPDATE (run)
        const method = sql.trim().toUpperCase().startsWith('SELECT') ? 'all' : 'run';

        db[method](sql, params, function (err, rows) {
            if (err) {
                console.error('SQL Error:', err.message, 'Query:', sql);
                reject(err);
            } else {
                // For run, 'this' contains lastID and changes
                if (method === 'run') {
                    resolve({ rows: [], lastID: this.lastID, changes: this.changes });
                } else {
                    resolve({ rows: rows });
                }
            }
        });
    });
}

// Special helper for run to get returning-like behavior if needed, 
// though we usually just need lastID.
// SQLite doesn't support RETURNING in all versions/drivers easily without extra steps,
// so we'll likely handle refetching in server.js or use lastID.

module.exports = {
    query,
    db
};
