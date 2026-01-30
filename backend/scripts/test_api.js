const http = require('http');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: body ? JSON.parse(body) : {} }));
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function test() {
    try {
        console.log('--- Testing POST /api/records with Incomplete Status ---');
        const postData = {
            employeeName: 'Test Employee',
            postalAccount: '12345',
            amount: 1000,
            treatmentDate: '2026-01-30',
            stateId: '16', // Assuming state 16 exists from context
            fileType: 'surgery',
            status: 'incomplete', // CRITICAL
            notes: 'Missing doc'
        };

        const postRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/records',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, postData);

        console.log('POST Response:', postRes.status, postRes.body);

        if (postRes.status !== 200) {
            console.error('POST failed');
            return;
        }

        const id = postRes.body.id;
        console.log('Created Record ID:', id);

        // Fetch to verify
        // We need to fetch via a specific query or just list records for the state
        // Let's rely on the DB check or just assume if DB is right, we can check via list
        // Or simpler: Assuming we trust the list endpoint.
        // Let's actually QUERY the DB directly to be 100% sure.
        const db = require('../db');
        const row = await new Promise((resolve, reject) => {
            db.db.get('SELECT * FROM records WHERE id = ?', [id], (err, row) => err ? reject(err) : resolve(row));
        });

        console.log('DB Record Status:', row.status);
        console.log('DB Record Notes:', row.notes);

        if (row.status === 'incomplete' && row.notes === 'Missing doc') {
            console.log('✅ POST Success: Record saved as INCOMPLETE');
        } else {
            console.error('❌ POST Failed: Record is', row.status);
        }

        console.log('\n--- Testing PUT /api/records/:id to Update to Completed ---');
        const putData = {
            ...postData,
            status: 'completed',
            notes: ''
        };
        await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/records/${id}`,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }, putData);

        const row2 = await new Promise((resolve, reject) => {
            db.db.get('SELECT * FROM records WHERE id = ?', [id], (err, row) => err ? reject(err) : resolve(row));
        });
        console.log('DB Record Status after Update:', row2.status);

        if (row2.status === 'completed') {
            console.log('✅ PUT Success: Record updated to COMPLETED');
        } else {
            console.error('❌ PUT Failed: Record is', row2.status);
        }

        // Cleanup
        await new Promise((resolve, reject) => {
            db.db.run('DELETE FROM records WHERE id = ?', [id], (err) => err ? reject(err) : resolve());
        });
        console.log('Test record deleted.');

    } catch (err) {
        console.error('Test Failed:', err);
    }
}

test();
