import api from './api';
import { Activity, ActivityResponse } from '../types/Activity';

export interface GetActivitiesParams {
    candidateID?: string;
    resumeID?: string; // Aligning with schema which uses resumeID
    campaignID?: string;
    limit?: number;
    page?: number;
    skip?: number;
    activityType?: string;
    activityGroup?: string;
    activityOf?: string;
}

export const activityService = {
    getAll: async (params: GetActivitiesParams): Promise<ActivityResponse> => {
        const response = await api.get('/activities', { params });
        return response.data;
    },

    log: async (data: Partial<Activity>): Promise<Activity> => {
        const response = await api.post('/activities', data);
        return response.data;
    },

    // Additional helper to get specific activity types if needed
    getByType: async (type: string, params: GetActivitiesParams): Promise<ActivityResponse> => {
        return activityService.getAll({ ...params, activityType: type });
    }
};
