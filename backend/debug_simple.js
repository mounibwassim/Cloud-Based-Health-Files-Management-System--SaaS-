const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query(`
    SELECT r.id, r.state_id, f.name 
    FROM records r 
    JOIN file_types f ON r.file_type_id = f.id
    WHERE r.user_id = (SELECT id FROM users WHERE username='wassim')
`).then(res => {
    console.log(JSON.stringify(res.rows));
    pool.end();
}).catch(e => console.error(e));
