const db = require('../db');

async function checkSchema() {
    try {
        console.log('Checking schema for table: records');
        db.db.all('PRAGMA table_info(records)', (err, rows) => {
            if (err) {
                console.error('Error fetching table info:', err);
                return;
            }
            // Log as JSON string for clarity
            console.log(JSON.stringify(rows, null, 2));

            const hasStatus = rows.some(r => r.name === 'status');
            if (hasStatus) {
                console.log('STATUS_COLUMN_EXISTS');
            } else {
                console.log('STATUS_COLUMN_MISSING');
            }
        });
    } catch (err) {
        console.error('Script failed:', err);
    }
}

checkSchema();
