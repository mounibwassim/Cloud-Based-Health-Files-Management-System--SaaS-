const axios = require('axios');
const fs = require('fs');
const API_URL = 'http://localhost:5000/api';

async function testAuth() {
    const log = [];
    const logFile = 'auth_test_results.txt';

    function record(msg) {
        console.log(msg);
        log.push(msg);
    }

    const testUser = {
        username: 'test_user_' + Date.now(),
        password: 'Password123!',
        role: 'doctor'
    };

    try {
        record(`[START] Testing with user: ${testUser.username}`);

        // 1. Register
        try {
            record(`[REQ] POST /register`);
            const regRes = await axios.post(`${API_URL}/register`, testUser);
            record(`[RES] Register Success: ${JSON.stringify(regRes.data)}`);

        } catch (e) {
            record(`[RES] Register Failed: ${e.response?.status} - ${JSON.stringify(e.response?.data || e.message)}`);
        }

        // 2. Login
        try {
            record(`[REQ] POST /login`);
            const loginRes = await axios.post(`${API_URL}/login`, {
                username: testUser.username,
                password: testUser.password
            });
            record(`[RES] Login Success: ${JSON.stringify(loginRes.data)}`);
        } catch (e) {
            record(`[RES] Login Failed: ${e.response?.status} - ${JSON.stringify(e.response?.data || e.message)}`);
        }

    } catch (err) {
        record(`[SYS] Error: ${err.message}`);
    } finally {
        fs.writeFileSync(logFile, log.join('\n'));
    }
}

testAuth();
