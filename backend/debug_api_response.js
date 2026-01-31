const axios = require('axios');

async function testApi() {
    try {
        // 1. Get List
        console.log("Fetching /api/states...");
        const resList = await axios.get('http://localhost:5000/api/states');
        console.log(`Status: ${resList.status}`);
        console.log(`Count: ${resList.data.length}`);
        if (resList.data.length > 0) {
            console.log("First State Sample:", resList.data[0]);
        } else {
            console.log("States list is empty!");
        }

        // 2. Get Detail
        console.log("\nFetching /api/states/1...");
        const resDetail = await axios.get('http://localhost:5000/api/states/1');
        console.log("Detail Status:", resDetail.status);
        console.log("Detail Data:", resDetail.data);

    } catch (err) {
        console.error("API Error:", err.message);
        if (err.response) {
            console.error("Response Status:", err.response.status);
            console.error("Response Data:", err.response.data);
        }
    }
}
testApi();
