const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../health_files.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // 1. Add reimbursement_amount to records
    db.run("ALTER TABLE records ADD COLUMN reimbursement_amount REAL", (err) => {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                console.log("Column 'reimbursement_amount' already exists in 'records'.");
            } else {
                console.error("Error adding column 'reimbursement_amount':", err.message);
            }
        } else {
            console.log("Column 'reimbursement_amount' added to 'records'.");
        }
    });
});

db.close();
