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

// The API lives on another site, so browsers that block third-party cookies drop the
// login cookie. Keep a copy of the token and send it as a header as well.
const TOKEN_KEY = 'hh_token';

export const getAuthToken = () => {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};

export const setAuthToken = (token) => {
    try {
        if (token) localStorage.setItem(TOKEN_KEY, token);
        else localStorage.removeItem(TOKEN_KEY);
    } catch { /* storage unavailable (private mode): cookie auth still works */ }
};

api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
