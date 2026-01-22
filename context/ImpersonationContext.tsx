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
        const currentUserStr = localStorage.getItem('user');

        if (adminToken && currentUserStr) {
            const user = JSON.parse(currentUserStr);
            // Decode token safely without library if needed, or rely on stored User object
            // For now, assume if admin_restore_token exists, we are impersonating
            setState({
                isImpersonating: true,
                targetUser: user,
                mode: user.mode || 'read-only', // Ensure backend sends 'mode' in user object or token
                impersonatorId: 'admin' // Placeholder or decode from token
            });
        }
    }, []);

    const startImpersonation = (token: string, targetUser: any, mode: 'read-only' | 'full') => {
        const currentAdminStr = localStorage.getItem('user');
        if (currentAdminStr) {
            const currentAdmin = JSON.parse(currentAdminStr);
            // Save Admin Token
            if (currentAdmin.token) {
                sessionStorage.setItem('admin_restore_token', currentAdmin.token);
                sessionStorage.setItem('admin_user_backup', currentAdminStr);
            }
        }

        // Swap to Target Token
        localStorage.setItem('user', JSON.stringify({ ...targetUser, token, mode }));

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
        const adminUserBackup = sessionStorage.getItem('admin_user_backup');

        if (adminToken && adminUserBackup) {
            // Restore Admin
            localStorage.setItem('user', adminUserBackup);

            // Clear Backup
            sessionStorage.removeItem('admin_restore_token');
            sessionStorage.removeItem('admin_user_backup');

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
