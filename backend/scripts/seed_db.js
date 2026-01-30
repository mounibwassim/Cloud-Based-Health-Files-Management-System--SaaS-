const fs = require('fs');
const path = require('path');
const db = require('../db');

async function seed() {
    try {
        const schemaPath = path.join(__dirname, '../../deployment/schema.sqlite.sql');
        const seedPath = path.join(__dirname, '../../deployment/seed.sql');

        console.log(`Reading schema from: ${schemaPath}`);
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log(`Reading seed from: ${seedPath}`);
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        console.log('Running schema...');
        // Split by semicolon because sqlite3 exec runs one at a time usually, but db.db.exec runs full script
        // We will use the raw sqlite3 object from our db wrapper
        const rawDb = db.db;

        await new Promise((resolve, reject) => {
            rawDb.exec(schemaSql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        console.log('Running seed...');
        await new Promise((resolve, reject) => {
            rawDb.exec(seedSql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
