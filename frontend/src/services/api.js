import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error('VITE_API_URL is not defined in environment variables');
}

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        // 'Content-Type': 'application/json', // Removed to allow Axios to set correct content type (e.g. for FormData)
    },
});

export default api;
