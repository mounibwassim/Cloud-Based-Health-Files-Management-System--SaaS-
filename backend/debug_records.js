const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function debug() {
    try {
        console.log("--- DEBUG START ---");

        // 1. Get User
        const userRes = await pool.query("SELECT * FROM users WHERE username = 'wassim'");
        if (userRes.rows.length === 0) {
            console.log("User 'wassim' not found!");
            return;
        }
        const user = userRes.rows[0];
        console.log(`User: ${user.username} (ID: ${user.id})`);

        // 2. Get State
        const stateCode = 16;
        const stateRes = await pool.query("SELECT * FROM states WHERE code = $1", [stateCode]);
        if (stateRes.rows.length === 0) {
            console.log(`State code ${stateCode} not found!`);
            return;
        }
        const stateInternalId = stateRes.rows[0].id; // Internal ID (e.g. 5)
        console.log(`State: ${stateRes.rows[0].name} (Code: ${stateCode}, Internal ID: ${stateInternalId})`);

        // 3. Get File Type
        const fileTypeName = 'ivf'; // Testing 'surgery' or 'ivf'
        const fileRes = await pool.query("SELECT * FROM file_types WHERE name = $1", [fileTypeName]);
        if (fileRes.rows.length === 0) {
            console.log(`File type ${fileTypeName} not found!`);
            return;
        }
        const fileTypeId = fileRes.rows[0].id;
        console.log(`File Type: ${fileTypeName} (ID: ${fileTypeId})`);

        // 4. CHECK ACTUAL RECORDS IN TABLE (Raw Dump)
        console.log("\n--- RAW RECORDS FOR THIS USER ---");
        const rawRes = await pool.query(`
            SELECT r.id, r.state_id, s.code as state_code, r.file_type_id, f.name as file_name, r.employee_name 
            FROM records r
            LEFT JOIN states s ON r.state_id = s.id
            LEFT JOIN file_types f ON r.file_type_id = f.id
            WHERE r.user_id = $1
        `, [user.id]);
        console.log("Raw Rows Found:", rawRes.rows.length);
        rawRes.rows.forEach(r => {
            console.log(`[Record ${r.id}] StateID:${r.state_id} (Code:${r.state_code}) | FileID:${r.file_type_id} (Name:'${r.file_name}') | Emp:${r.employee_name}`);
        });

        // 5. TEST COUNT QUERY LOGIC (From GET /states/:id)
        console.log("\n--- TESTING COUNT QUERY ---");
        const countQuery = `
            SELECT COUNT(*) FROM records r 
            WHERE r.file_type_id = $1
            AND r.state_id = $2
            AND r.user_id = $3
        `;
        const countRes = await pool.query(countQuery, [fileTypeId, stateInternalId, user.id]);
        console.log(`Count Result: ${countRes.rows[0].count}`);

        // 6. TEST LIST QUERY LOGIC (From GET /states/:id/files/:type/records)
        console.log("\n--- TESTING LIST QUERY ---");
        const listQuery = `
            SELECT r.*, f.name as file_type_name
            FROM records r
            JOIN file_types f ON r.file_type_id = f.id
            WHERE r.state_id = (SELECT id FROM states WHERE code = $1)
            AND f.name = $2
            AND r.user_id = $3
        `;
        // Note: Backend uses stateCode (params) and fileTypeName (params)
        const listRes = await pool.query(listQuery, [stateCode, fileTypeName, user.id]);
        console.log(`List Result Rows: ${listRes.rows.length}`);

        if (listRes.rows.length === 0) {
            console.log("!!! LIST QUERY FAILED TO FIND RECORDS !!!");
            // Debug Subquery
            const subRes = await pool.query("SELECT id FROM states WHERE code = $1", [stateCode]);
            console.log("Subquery (State ID from Code) returns:", subRes.rows);
        }

    } catch (err) {
        console.error("Debug Error:", err);
    } finally {
        pool.end();
    }
}

debug();
