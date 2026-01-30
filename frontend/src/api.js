import axios from 'axios';

// Use environment variable for API URL (production) or fallback to proxy (local)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
