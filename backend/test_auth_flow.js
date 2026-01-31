const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

async function testAuth() {
    const testUser = {
        username: 'test_user_' + Date.now(),
        password: 'Password123!',
        role: 'doctor' // or whatever role is valid
    };

    try {
        // 1. Register
        console.log(`[TEST] Registering user: ${testUser.username}`);
        try {
            const regRes = await axios.post(`${API_URL}/register`, testUser);
            console.log('[TEST] Registration Success:', regRes.data);
        } catch (e) {
            console.error('[TEST] Registration Failed:', e.response?.data || e.message);
        }

        // 2. Login
        console.log(`[TEST] Logging in user: ${testUser.username}`);
        try {
            const loginRes = await axios.post(`${API_URL}/login`, {
                username: testUser.username,
                password: testUser.password
            });
            console.log('[TEST] Login Success:', loginRes.data);
        } catch (e) {
            console.error('[TEST] Login Failed:', e.response?.data || e.message);
        }

    } catch (err) {
        console.error('[TEST] System Error:', err.message);
    }
}

testAuth();
