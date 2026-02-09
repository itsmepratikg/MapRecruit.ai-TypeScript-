import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface ImpersonationState {
    isImpersonating: boolean;
    impersonatorId?: string;
    targetUser?: any;
    mode: 'read-only' | 'full';
}

interface ImpersonationContextType extends ImpersonationState {
    startImpersonation: (token: string, targetUser: any, mode: 'read-only' | 'full') => void;
    stopImpersonation: () => void;
}

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined);

export const ImpersonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<ImpersonationState>({
        isImpersonating: false,
        mode: 'read-only'
    });

    useEffect(() => {
        // Sync with storage on mount
        const adminToken = sessionStorage.getItem('admin_restore_token');
        const mode = sessionStorage.getItem('impersonation_mode') as 'read-only' | 'full';

        if (adminToken) {
            setState({
                isImpersonating: true,
                mode: mode || 'read-only'
            });
        }
    }, []);

    const startImpersonation = (token: string, targetUser: any, mode: 'read-only' | 'full') => {
        const currentAdminToken = sessionStorage.getItem('authToken');

        if (currentAdminToken) {
            sessionStorage.setItem('admin_restore_token', currentAdminToken);
        }

        // Set Impersonation Context
        sessionStorage.setItem('impersonation_mode', mode);

        // Swap to Target Token
        sessionStorage.setItem('authToken', token);

        setState({
            isImpersonating: true,
            targetUser,
            mode
        });

        // Hard Reload to reset all app states/sockets/etc with new token
        window.location.reload();
    };

    const stopImpersonation = () => {
        const adminToken = sessionStorage.getItem('admin_restore_token');

        if (adminToken) {
            // Restore Admin Token
            sessionStorage.setItem('authToken', adminToken);

            // Clear Backup & Context
            sessionStorage.removeItem('admin_restore_token');
            sessionStorage.removeItem('impersonation_mode');

            setState({ isImpersonating: false, mode: 'read-only' });

            window.location.reload();
        }
    };

    return (
        <ImpersonationContext.Provider value={{ ...state, startImpersonation, stopImpersonation }}>
            {children}
        </ImpersonationContext.Provider>
    );
};

export const useImpersonation = () => {
    const context = useContext(ImpersonationContext);
    if (!context) {
        throw new Error('useImpersonation must be used within an ImpersonationProvider');
    }
    return context;
};
