
import React from 'react';
import { ChevronLeft } from '../Icons';
import { NavItem } from './NavItem';
import { USER_MANAGEMENT_MENU } from './constants';
import { useScreenSize } from '../../hooks/useScreenSize';

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
    activeAdminUserTab,
    setActiveAdminUserTab,
    selectedAdminUser,
    isCollapsed,
    setIsSidebarOpen
}: UserAdminMenuProps) => {
    const { isDesktop } = useScreenSize();

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
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{selectedAdminUser?.name}</p>
            </div>

            <div className="space-y-1">
                {USER_MANAGEMENT_MENU.map((item, index) => (
                    <div key={item.id} className="animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                        <NavItem 
                            icon={item.icon} 
                            label={item.label} 
                            activeTab={activeAdminUserTab === item.id} 
                            onClick={() => { setActiveAdminUserTab(item.id); if (!isDesktop) setIsSidebarOpen(false); }}
                            isCollapsed={isCollapsed}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
