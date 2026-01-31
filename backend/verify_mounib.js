const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

async function verifyMounib() {
    console.log("1. Triggering System Repair to reset mounib...");
    try {
        await axios.get('http://localhost:5000/api/fix-system');
        console.log("Repair Triggered.");
    } catch (e) {
        console.log("Repair trigger might have failed or verify if it returns HTML", e.message);
    }

    console.log("2. Attempting Login with mounib / Mounib$7 ...");
    try {
        const res = await axios.post(`${API_URL}/login`, {
            username: 'mounib',
            password: 'Mounib$7'
        });
        console.log("LOGIN SUCCESS! Token received:", res.data.token ? "YES" : "NO");
        console.log("User:", res.data.user);
    } catch (e) {
        console.error("LOGIN FAILED:", e.response?.data || e.message);
    }
}

verifyMounib();
