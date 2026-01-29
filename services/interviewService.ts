import api from './api';

const API_URL = '/interviews';

export const interviewService = {
    getAll: async (params?: { resumeID?: string, campaignID?: string }) => {
        const response = await api.get(API_URL, {
            params
        });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`${API_URL}/${id}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post(API_URL, data);
        return response.data;
    },

    update: async (id: string, data: any) => {
        const response = await api.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`${API_URL}/${id}`);
        return response.data;
    }
};

export default interviewService;
