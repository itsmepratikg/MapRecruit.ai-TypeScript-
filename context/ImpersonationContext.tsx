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
        const adminToken = localStorage.getItem('admin_restore_token');
        const mode = localStorage.getItem('impersonation_mode') as 'read-only' | 'full';

        if (adminToken) {
            setState({
                isImpersonating: true,
                mode: mode || 'read-only'
            });
        }
    }, []);

    const startImpersonation = (token: string, targetUser: any, mode: 'read-only' | 'full') => {
        const currentAdminToken = localStorage.getItem('authToken');

        if (currentAdminToken) {
            localStorage.setItem('admin_restore_token', currentAdminToken);
        }

        // Set Impersonation Context
        localStorage.setItem('impersonation_mode', mode);

        // Swap to Target Token
        localStorage.setItem('authToken', token);

        setState({
            isImpersonating: true,
            targetUser,
            mode
        });

        // Hard Reload to reset all app states/sockets/etc with new token
        window.location.reload();
    };

    const stopImpersonation = () => {
        const adminToken = localStorage.getItem('admin_restore_token');

        if (adminToken) {
            // Restore Admin Token
            localStorage.setItem('authToken', adminToken);

            // Clear Backup & Context
            localStorage.removeItem('admin_restore_token');
            localStorage.removeItem('impersonation_mode');

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
