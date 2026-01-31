const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

async function verifyState(stateCode) {
    // 1. Login to get token
    try {
        const loginRes = await axios.post(`${API_URL}/login`, { username: 'mounib', password: 'Mounib$7' });
        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Fetch State Details
        console.log(`Fetching State ${stateCode}...`);
        const stateRes = await axios.get(`${API_URL}/states/${stateCode}`, { headers });
        console.log("State Data:", stateRes.data);

        // 3. Fetch Counts
        console.log(`Fetching Counts for State ${stateCode}...`);
        const countsRes = await axios.get(`${API_URL}/states/${stateCode}/counts`, { headers });
        console.log("Counts Data:", countsRes.data);

    } catch (e) {
        console.error("Verification Failed:", e.response?.data || e.message);
    }
}

verifyState(16); // Test Algiers
