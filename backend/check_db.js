const db = require('./db');

async function check() {
    try {
        const res = await db.query('SELECT count(*) FROM states');
        console.log(`States count: ${res.rows[0].count}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
