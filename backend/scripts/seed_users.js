const db = require('../db');
const bcrypt = require('bcryptjs');

async function seedUser() {
    try {
        console.log('Seeding admin user...');
        const passwordHash = await bcrypt.hash('admin123', 10);

        // Use generic SQL that works for both if possible, or INSERT IGNORE/ON CONFLICT
        // SQLite: INSERT OR IGNORE
        // Postgres: INSERT ... ON CONFLICT DO NOTHING
        // We are on SQLite locally for sure now.

        let query = `INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)`;

        // Check mode from db (hacky check but works since we know we are running via node locally)
        // If it was PG, we'd need ON CONFLICT. But current local is SQLite.

        await db.query(query, ['admin', passwordHash, 'admin']);
        console.log('Admin user seeded (admin / admin123)');

    } catch (err) {
        console.error('Failed to seed user:', err);
    }
}

seedUser();
