const axios = require('axios');

async function testFullFlow() {
    try {
        // 1. Login
        console.log("Logging in...");
        const loginRes = await axios.post('http://localhost:5000/api/login', {
            username: 'mounib',
            password: 'Mounib$7'
        });

        const token = loginRes.data.token;
        console.log("Login Success. Token:", token ? "Received" : "Missing");

        if (!token) {
            console.error("No token received!");
            return;
        }

        // 2. Fetch State 16 (Algiers)
        console.log("\nFetching State 16...");
        const stateRes = await axios.get('http://localhost:5000/api/states/16', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("State Status:", stateRes.status);
        console.log("State Data:", stateRes.data);

    } catch (err) {
        console.error("Flow Error:", err.message);
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        }
    }
}
testFullFlow();
