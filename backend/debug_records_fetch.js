const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

async function debugFetch() {
    try {
        // 1. Login
        const loginRes = await axios.post(`${API_URL}/login`, { username: 'mounib', password: 'Mounib$7' });
        const token = loginRes.data.token;

        // 2. Fetch Records
        const url = `${API_URL}/states/16/files/ivf/records`;
        console.log(`Fetching: ${url}`);

        const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Response Status:", res.status);
        console.log("Records Found:", res.data.length);
        if (res.data.length > 0) {
            console.log("First Record Sample:", JSON.stringify(res.data[0], null, 2));

            // Check for potential crashers
            res.data.forEach((r, i) => {
                if (!r.employee_name) console.error(`Record ${i} missing employee_name!`);
                if (!r.status) console.warn(`Record ${i} missing status!`);
            });
        }

    } catch (e) {
        console.error("Fetch Failed:", e.response?.data || e.message);
    }
}

debugFetch();
