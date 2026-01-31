const axios = require('axios');

async function repair() {
    try {
        console.log("Triggering /api/fix-system...");
        const res = await axios.get('http://localhost:5000/api/fix-system');
        console.log("Repair Response:", res.data);
    } catch (err) {
        console.error("Repair Failed:", err.message);
    }
}
repair();
