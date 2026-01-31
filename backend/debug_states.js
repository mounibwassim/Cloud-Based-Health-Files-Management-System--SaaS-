const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query("SELECT id, code, name FROM states WHERE code = 16 OR code = 19 ORDER BY code").then(res => {
    console.log(JSON.stringify(res.rows));
    pool.end();
}).catch(e => console.error(e));
