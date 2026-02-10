const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function migrate() {
    try {
        console.log("Starting migration: Add serial_number...");

        // 1. Add Column
        await pool.query(`
      ALTER TABLE records 
      ADD COLUMN IF NOT EXISTS serial_number INTEGER;
    `);
        console.log("Column added.");

        // 2. Populate existing records with ROW_NUMBER()
        // We update them so they have a value.
        // Scoped by state_id AND file_type_id, ordered by treatment_date

        // Postgres Update with Join/Subquery is tricky for window functions. 
        // Easier loop approach in script for safety, or common table expression.

        console.log("Populating existing serial numbers...");

        // Using a CTE to calculate correct serials
        await pool.query(`
      WITH numbered_records AS (
        SELECT id, 
               ROW_NUMBER() OVER (
                 PARTITION BY state_id, file_type_id 
                 ORDER BY treatment_date ASC, created_at ASC
               ) as new_serial
        FROM records
      )
      UPDATE records
      SET serial_number = numbered_records.new_serial
      FROM numbered_records
      WHERE records.id = numbered_records.id
      AND records.serial_number IS NULL;
    `);

        console.log("Existing records populated.");

        console.log("Migration Complete.");
        process.exit(0);
    } catch (err) {
        console.error("Migration Failed:", err);
        process.exit(1);
    }
}

migrate();
