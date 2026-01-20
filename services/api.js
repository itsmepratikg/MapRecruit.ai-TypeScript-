import axios from 'axios';
import {
    MOCK_USERS_LIST,
    GLOBAL_CAMPAIGNS,
    MOCK_PROFILES,
    DEFAULT_USER_ACCOUNT
} from '../data';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the Token
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('user');
        if (user) {
            const { token } = JSON.parse(user);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error("Login Failed:", error.response?.data?.message || error.message);
            throw error;
        }
    },
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('user');
    },
};

export const userService = {
    getAll: async () => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            console.warn("API Error: Using local Users data");
            return MOCK_USERS_LIST;
        }
    },
    getById: async (id) => {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.warn("API Error: User fallback");
            return MOCK_USERS_LIST.find(u => u.id === id) || null;
        }
    },
    create: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },
    update: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },
    updateActiveAt: async () => {
        // This endpoint doesn't exist yet but it's a lightweight update
        try {
            await api.post('/users/active');
        } catch (e) { /* ignore */ }
    },
    resetPassword: async (id) => {
        const response = await api.post(`/users/${id}/reset-password`);
        return response.data;
    }
};

export const campaignService = {
    getAll: async () => {
        try {
            const response = await api.get('/campaigns');
            return response.data;
        } catch (error) {
            console.warn("API Error: Using local Campaigns data");
            return GLOBAL_CAMPAIGNS;
        }
    },
    getStats: async () => {
        try {
            const response = await api.get('/campaigns/stats');
            return response.data;
        } catch (error) {
            console.warn("API Error: Stats fallback");
            return {
                active: GLOBAL_CAMPAIGNS.filter(c => c.status === 'Active').length,
                closed: GLOBAL_CAMPAIGNS.filter(c => c.status === 'Closed').length,
                archived: GLOBAL_CAMPAIGNS.filter(c => c.status === 'Archived').length,
            };
        }
    },
    getRecent: async () => {
        try {
            const response = await api.get('/campaigns/recent');
            return response.data;
        } catch (error) {
            console.warn("API Error: Recent campaigns fallback");
            return GLOBAL_CAMPAIGNS.slice(0, 5);
        }
    },
    create: async (campaignData) => {
        const response = await api.post('/campaigns', campaignData);
        return response.data;
    },
};

export const profileService = {
    getAll: async () => {
        try {
            const response = await api.get('/profiles');
            return response.data;
        } catch (error) {
            console.warn("API Error: Using local Profiles data");
            return MOCK_PROFILES;
        }
    },
    create: async (profileData) => {
        const response = await api.post('/profiles', profileData);
        return response.data;
    },
};

export const passkeyService = {
    getRegistrationOptions: async (deviceType) => {
        const response = await api.post('/auth/passkey/register-options', { deviceType });
        return response.data;
    },
    verifyRegistration: async (body, deviceType) => {
        const response = await api.post('/auth/passkey/register-verify', { body, deviceType });
        return response.data;
    },
    getAuthenticationOptions: async (email) => {
        const response = await api.post('/auth/passkey/login-options', { email });
        return response.data;
    },
    verifyLogin: async (email, body) => {
        const response = await api.post('/auth/passkey/login-verify', { email, body });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    }
};

export default api;
