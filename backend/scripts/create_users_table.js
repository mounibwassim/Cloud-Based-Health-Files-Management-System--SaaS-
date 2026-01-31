const db = require('../db');

const createTableSql = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'manager',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`;

async function createUsersTable() {
    try {
        console.log('Creating users table...');
        await db.query(createTableSql);
        console.log('Table created successfully.');

        // Check if admin user exists, if not create one
        // We need bcryptjs to hash the default password
        // But we can't require it if it's not installed yet (though we just ran install).
        // Let's separate seeding or do it if we can.
        // For now, just create the table.
    } catch (err) {
        console.error('Failed to create users table:', err);
    }
}

createUsersTable();
