const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

async function debugWassim() {
    console.log("Attempting to register 'wassim'...");
    try {
        const res = await axios.post(`${API_URL}/register`, {
            username: 'wassim',
            password: 'Password123!'
        });
        console.log("SUCCESS:", res.data);
    } catch (e) {
        console.log("ERROR STATUS:", e.response?.status);
        console.log("ERROR DATA:", e.response?.data);
        console.log("ERROR MSG:", e.message);
    }

    console.log("Attempting to login 'wassim'...");
    try {
        const res = await axios.post(`${API_URL}/login`, {
            username: 'wassim',
            password: 'Password123!'
        });
        console.log("LOGIN SUCCESS:", res.data);
    } catch (e) {
        console.log("LOGIN ERROR:", e.response?.data || e.message);
    }
}

debugWassim();
