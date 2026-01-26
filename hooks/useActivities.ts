import { useState, useEffect, useCallback } from 'react';
import { activityService } from '../services/api';

export const useActivities = (params: { candidateID?: string, campaignID?: string, limit?: number }) => {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchActivities = useCallback(async () => {
        if (!params.candidateID && !params.campaignID) return;

        try {
            setLoading(true);
            const data = await activityService.getAll(params);
            setActivities(data);
            setError(null);
        } catch (err: any) {
            console.error("Error fetching activities:", err);
            setError(err.message || 'Failed to load activities');
        } finally {
            setLoading(false);
        }
    }, [params.candidateID, params.campaignID, params.limit]);

    const logActivity = async (data: { type: string, title: string, description?: string, metadata?: any }) => {
        try {
            const newActivity = await activityService.log({
                ...data,
                candidateID: params.candidateID,
                campaignID: params.campaignID
            });
            setActivities(prev => [newActivity, ...prev]);
            return newActivity;
        } catch (err: any) {
            console.error("Error logging activity:", err);
            throw err;
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    return { activities, loading, error, refetch: fetchActivities, logActivity };
};
