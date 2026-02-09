
import { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import { UserProfileData } from '../data/profile';

const EVENT_KEY = 'profile-updated';

export const useUserProfile = () => {
    const { userProfile, loading, error, refetchProfile, setUserProfile } = useUserContext();

    // Derived state or additional logic can go here if needed
    // For now, we just expose what Context provides plus the 'save' helpers

    const saveProfile = async (data: Partial<UserProfileData>) => {
        try {
            const { userService } = await import('../services/api');
            if (userProfile?._id) {
                const updated = await userService.update(userProfile._id, data);

                // Update Context State
                setUserProfile(prev => prev ? ({ ...prev, ...updated }) : null);

                // Update Local Cache
                const cached = localStorage.getItem('user_profile_cache');
                if (cached) {
                    const parsed = JSON.parse(cached);
                    const newCache = { ...parsed, ...updated };
                    localStorage.setItem('user_profile_cache', JSON.stringify(newCache));
                }

                window.dispatchEvent(new Event(EVENT_KEY));
            }
        } catch (err) {
            console.error("Failed to save profile", err);
            throw err;
        }
    };

    const updateAvatar = async (file: File): Promise<void> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result as string;
                await saveProfile({ avatar: base64 });
                resolve();
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Client Fetching Logic (kept here or moved to another hook? Kept for backward compatibility)
    // We can use a simple state for clients since it's often used with profile
    const [clients, setClients] = useState<any[]>([]);

    useEffect(() => {
        if (!userProfile) return;

        let isMounted = true;
        const fetchClients = async () => {
            // Simple caching or deduping can be added here if needed, 
            // but keeping it simple for now as it's separate from 'Auth'
            try {
                const { clientService } = await import('../services/api');
                const data = await clientService.getAll();
                if (isMounted) setClients(data);
            } catch (err) {
                console.error("Failed to load clients", err);
            }
        };

        fetchClients();
        return () => { isMounted = false; };
    }, [userProfile]);

    return {
        userProfile,
        loading,
        error,
        refetchProfile,
        clients,
        saveProfile,
        updateAvatar
    };
};
