import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { UserProfileData } from '../data/profile';
import { useNavigate, useLocation } from 'react-router-dom';

interface UserContextType {
    userProfile: UserProfileData | null;
    loading: boolean;
    error: string | null;
    refetchProfile: () => Promise<void>;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfileData | null>>;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const STORAGE_KEY_PROFILE = 'user_profile_cache';
const STORAGE_KEY_EXPIRY = 'session_expiry';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Throttling ref for activity updates
    const lastActivityUpdate = useRef<number>(Date.now());

    const logout = useCallback(() => {
        setUserProfile(null);
        sessionStorage.removeItem('authToken');
        localStorage.removeItem(STORAGE_KEY_PROFILE);
        localStorage.removeItem(STORAGE_KEY_EXPIRY);
        navigate('/');
    }, [navigate]);

    const updateSessionExpiry = useCallback(() => {
        const now = Date.now();
        // Only update if more than 1 minute has passed since last update to avoid excessive writes
        if (now - lastActivityUpdate.current > 60000) {
            const newExpiry = now + SESSION_TIMEOUT_MS;
            localStorage.setItem(STORAGE_KEY_EXPIRY, newExpiry.toString());
            lastActivityUpdate.current = now;
        }
    }, []);

    const checkSession = useCallback(() => {
        const expiryStr = localStorage.getItem(STORAGE_KEY_EXPIRY);
        if (!expiryStr) return;

        const expiry = parseInt(expiryStr, 10);
        const now = Date.now();

        if (now > expiry) {
            console.warn("[Session] Expired due to inactivity.");
            logout();
        }
    }, [logout]);

    const refetchProfile = useCallback(async () => {
        try {
            const { default: api } = await import('../services/api');
            const response = await api.get('/auth/me');
            if (response.data) {
                const userData = response.data;
                const mappedProfile = {
                    ...userData,
                    _id: userData._id || userData.id,
                    phone: userData.phone || userData.mobile || userData.phoneNumber,
                    teams: Array.isArray(userData.clientID)
                        ? userData.clientID.map((c: any) => typeof c === 'object' ? (c.clientName || c.name) : c)
                        : (userData.teams || []),
                };
                setUserProfile(mappedProfile);
                localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(mappedProfile));
                updateSessionExpiry();
            }
        } catch (err) {
            console.error("Profile refresh failed", err);
            // If 401, we might want to logout, but let the interceptor handle that usually
        }
    }, [updateSessionExpiry]);

    // Initial Load & Verification
    useEffect(() => {
        const initUser = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setLoading(false);
                return;
            }

            // 1. Try loading from cache for instant render
            const cachedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
            const expiryStr = localStorage.getItem(STORAGE_KEY_EXPIRY);

            if (cachedProfile && expiryStr) {
                const expiry = parseInt(expiryStr, 10);
                if (Date.now() < expiry) {
                    try {
                        setUserProfile(JSON.parse(cachedProfile));
                    } catch (e) {
                        console.error("Failed to parse cached profile", e);
                    }
                } else {
                    // Cache expired
                    logout();
                    setLoading(false);
                    return;
                }
            }

            // 2. Fetch fresh data (Stale-while-revalidate)
            try {
                const { default: api } = await import('../services/api');
                const response = await api.get('/auth/me');

                if (response.data) {
                    const userData = response.data;
                    const mappedProfile = {
                        ...userData,
                        _id: userData._id || userData.id,
                        phone: userData.phone || userData.mobile || userData.phoneNumber,
                        teams: Array.isArray(userData.clientID)
                            ? userData.clientID.map((c: any) => typeof c === 'object' ? (c.clientName || c.name) : c)
                            : (userData.teams || []),
                    };
                    setUserProfile(mappedProfile);
                    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(mappedProfile));

                    // Initialize or refresh expiry
                    const newExpiry = Date.now() + SESSION_TIMEOUT_MS;
                    localStorage.setItem(STORAGE_KEY_EXPIRY, newExpiry.toString());
                }
            } catch (err: any) {
                setError("Failed to load profile");
                if (err.response?.status === 401 || err.response?.status === 404) {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };

        initUser();
    }, [logout]);

    // Activity Listeners
    useEffect(() => {
        // Only attach listeners if user is logged in
        if (!userProfile) return;

        const handleActivity = () => {
            checkSession();
            updateSessionExpiry();
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('click', handleActivity);
        window.addEventListener('scroll', handleActivity);

        // Periodic check in case no events fire but time passes (e.g. background tab)
        const interval = setInterval(checkSession, 60000); // Check every minute

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('scroll', handleActivity);
            clearInterval(interval);
        };
    }, [userProfile, checkSession, updateSessionExpiry]);

    return (
        <UserContext.Provider value={{
            userProfile,
            loading,
            error,
            refetchProfile,
            setUserProfile,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
