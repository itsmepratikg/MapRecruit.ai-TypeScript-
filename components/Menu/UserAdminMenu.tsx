import React from 'react';
import { ChevronLeft } from '../Icons';
import { NavItem } from './NavItem';
import { USER_MANAGEMENT_MENU } from './constants';
import { useScreenSize } from '../../hooks/useScreenSize';
import { useNavigate, useLocation } from 'react-router-dom';

interface UserAdminMenuProps {
    onBack: () => void;
    activeAdminUserTab: string;
    setActiveAdminUserTab: (v: string) => void;
    selectedAdminUser: any;
    isCollapsed: boolean;
    setIsSidebarOpen: (v: boolean) => void;
}

export const UserAdminMenu = ({
    onBack,
    setActiveAdminUserTab,
    selectedAdminUser,
    isCollapsed,
    setIsSidebarOpen
}: UserAdminMenuProps) => {
    const { isDesktop } = useScreenSize();
    const navigate = useNavigate();
    const location = useLocation();

    const getPath = (id: string) => {
        const map: Record<string, string> = {
            'BASIC_DETAILS': 'basicdetails',
            'COMM_PREFS': 'communication',
            'USER_PREFS': 'appearance',
            'CALENDAR': 'calendar',
            'ROLES_PERMISSIONS': 'rolepermissions',
            'AUTH_SYNC': 'authsync',
            'USER_NOTIFICATIONS': 'usernotifications',
            'LAST_LOGIN': 'loginsessions',
            'SETTINGS': 'settings',
            'ACTIVITIES': 'activities'
        };
        if (map[id]) return map[id];
        return id.toLowerCase();
    };

    // /settings/Users/userprofile/basicdetails/usr_123 -> basicdetails and usr_123
    const pathParts = location.pathname.split('/userprofile/')[1]?.split('/') || [];
    const currentPath = pathParts[0] || 'basicdetails';
    const userId = pathParts[1] || selectedAdminUser?.id || selectedAdminUser?._id;

    return (
        <div className="animate-in slide-in-from-left duration-300 ease-out">
            <button
                onClick={onBack}
                className={`w-full flex items-center gap-2 px-3 py-2 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                title="Back to Users"
            >
                <ChevronLeft size={14} /> <span className={isCollapsed ? 'hidden' : 'inline'}>Back to Users</span>
            </button>

            <div className={`px-3 mb-6 ${isCollapsed ? 'hidden' : 'block'}`}>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">Manage User</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{selectedAdminUser?.name || 'User Profile'}</p>
            </div>

            <div className="space-y-1">
                {USER_MANAGEMENT_MENU.map((item, index) => {
                    const path = getPath(item.id);
                    return (
                        <div key={item.id} className="animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                            <NavItem
                                icon={item.icon}
                                label={item.label}
                                activeTab={currentPath === path}
                                to={`/settings/Users/userprofile/${path}/${userId}`}
                                onClick={() => {
                                    setActiveAdminUserTab(item.id);
                                    if (!isDesktop) setIsSidebarOpen(false);
                                }}
                                isCollapsed={isCollapsed}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
