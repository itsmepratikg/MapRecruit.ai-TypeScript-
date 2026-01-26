import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

import { attachSafetyInterceptor } from './SafetyInterceptor';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach Safety Interceptor
attachSafetyInterceptor(api);

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
    switchCompany: async (companyId, clientId) => {
        const response = await api.post('/auth/switch-context', { companyId, clientId });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    }
};

export const userService = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
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
        const response = await api.get('/campaigns');
        return response.data;
    },
    getStats: async () => {
        const response = await api.get('/campaigns/stats');
        return response.data;
    },
    getRecent: async () => {
        const response = await api.get('/campaigns/recent');
        return response.data;
    },
    create: async (campaignData) => {
        const response = await api.post('/campaigns', campaignData);
        return response.data;
    },
};

export const clientService = {
    getAll: async () => {
        const response = await api.get('/clients');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/clients/${id}`);
        return response.data;
    }
};

export const profileService = {
    getAll: async () => {
        const response = await api.get('/profiles');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/profiles/${id}`);
        return response.data;
    },
    create: async (profileData) => {
        const response = await api.post('/profiles', profileData);
        return response.data;
    },
    update: async (id, profileData) => {
        const response = await api.put(`/profiles/${id}`, profileData);
        return response.data;
    }
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

export const companyService = {
    get: async () => {
        const response = await api.get('/company');
        return response.data;
    },
    update: async (companyData) => {
        const response = await api.put('/company', companyData);
        return response.data;
    }
};

export const workflowService = {
    getByCampaign: async (campaignId) => {
        const response = await api.get(`/workflows/${campaignId}`);
        return response.data;
    },
    save: async (data) => {
        const response = await api.post('/workflows', data);
        return response.data;
    }
};

export const activityService = {
    getAll: async (params) => {
        const response = await api.get('/activities', { params });
        return response.data;
    },
    log: async (data) => {
        const response = await api.post('/activities', data);
        return response.data;
    }
};

export default api;
