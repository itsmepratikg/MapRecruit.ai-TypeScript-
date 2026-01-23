
import React, { createContext, useContext } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { Lock } from '../Icons';

interface SafeKeeperContextType {
    canEdit: boolean;
    isLocked: boolean;
}

const SafeKeeperContext = createContext<SafeKeeperContextType>({ canEdit: true, isLocked: false });

export const useSafeKeeper = () => useContext(SafeKeeperContext);

interface SafeKeeperProps {
    children: React.ReactNode;
    permissionPath: string[]; // e.g. ['Source AI', 'sourceAI', 'campaigns', 'updateCampaign']
    mode?: 'hide' | 'disable' | 'warn';
    fallback?: React.ReactNode;
}

/**
 * SafeKeeper Wrapper
 * Automatically manages form state based on RBAC permissions.
 */
export const SafeKeeper: React.FC<SafeKeeperProps> & { Action: React.FC<ActionProps> } = ({
    children,
    permissionPath,
    mode = 'disable',
    fallback
}) => {
    const { can } = usePermissions();
    const hasPermission = can(...permissionPath);

    if (!hasPermission && mode === 'hide') {
        return <>{fallback || null}</>;
    }

    const contextValue = {
        canEdit: hasPermission,
        isLocked: !hasPermission
    };

    return (
        <SafeKeeperContext.Provider value={contextValue}>
            <div className="relative h-full flex flex-col">
                {!hasPermission && mode === 'warn' && (
                    <div className="shrink-0 mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3 text-amber-700 dark:text-amber-400 text-sm font-medium">
                        <Lock size={18} />
                        <span>You have read-only access to this section. Changes cannot be saved.</span>
                    </div>
                )}
                <div className="flex-1 min-h-0 w-full">
                    {children}
                </div>
            </div>
        </SafeKeeperContext.Provider>
    );
};

interface ActionProps {
    children: React.ReactNode;
    actionPermission?: string; // Optional specific action permission
}

/**
 * SafeKeeper.Action
 * Wraps buttons (Save, Delete, Add) to hide/disable them if parent is locked.
 */
SafeKeeper.Action = ({ children, actionPermission }: ActionProps) => {
    const { canEdit } = useSafeKeeper();
    const { can } = usePermissions();

    // If a specific action permission is provided, check that too
    const actionAllowed = actionPermission ? can(actionPermission) : true;

    if (!canEdit || !actionAllowed) {
        return null; // For standard "Safe Keeper" mode, we hide the action entirely
    }

    return <>{children}</>;
};
