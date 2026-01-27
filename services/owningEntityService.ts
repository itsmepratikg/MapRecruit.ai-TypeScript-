import api from './api';

export interface OwningEntity {
    _id: string;
    name: string;
    franchiseName?: string;
    clientIDs: string[]; // ObjectIds as strings
}

export const owningEntityService = {
    /**
     * Get Owning Entity by Client ID
     * Returns the entity that "owns" this client, or null if none.
     */
    getByClientId: async (clientId: string): Promise<OwningEntity | null> => {
        try {
            const response = await api.get(`/owning-entities/by-client/${clientId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Owning Entity:', error);
            return null;
        }
    }
};
