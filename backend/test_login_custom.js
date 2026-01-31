const axios = require('axios');

async function testLogin() {
    try {
        console.log("Attempting login for 'wassim' with password 'wassim' (assuming simple reg)...");
        // Try 'wassim' first? Or maybe 'Wassim$7'? 
        // Let's try what the user likely entered: 'wassim' or the password they used.
        // I'll try 'wassim' first.
        let pass = 'wassim';
        try {
            await doLogin('wassim', pass);
        } catch (e) {
            console.log("Failed with 'wassim'. Trying '123456'...");
            try { await doLogin('wassim', '123456'); } catch (e2) {
                console.log("Failed with '123456'. Trying 'Wassim$7'...");
                await doLogin('wassim', 'Wassim$7');
            }
        }

    } catch (err) {
        console.error("All login attempts failed.");
    }
}

async function doLogin(u, p) {
    console.log(`Trying username='${u}' password='${p}'`);
    const res = await axios.post('http://localhost:5000/api/login', {
        username: u,
        password: p
    });
    console.log("SUCCESS! Token received:", res.data.token ? "YES" : "NO");
}

testLogin();
