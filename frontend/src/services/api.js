import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle Network Errors (no response)
        if (!error.response) {
            console.error("Network Error:", error);
            return Promise.reject(new Error("Unable to connect to the server. Please check your internet connection or try again later."));
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/users/token/refresh/`, {
                        refresh: refreshToken,
                    });
                    localStorage.setItem('access', response.data.access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                }
            } catch (err) {
                console.error("Refresh token expired", err);
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const getContests = () => api.get('/contests/');
export const getProblems = (params) => api.get('/problems/', { params });
export const getUserSubmissions = () => api.get('/users/submissions/');
export const getFriends = () => api.get('/users/friends/');
export const addFriend = (username) => api.post('/users/friends/', { username });
export const getCFUser = (handle) => axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
export const getPublicUser = (query) => api.get(`/users/public/${query}/`);
export const searchUsers = (query) => api.get(`/users/search/?q=${query}`);
export const getCFSubmissions = (handle) => axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
export const getChatHistory = (otherUsername) => api.get(`/chat/history/${otherUsername}/`);

export default api;
