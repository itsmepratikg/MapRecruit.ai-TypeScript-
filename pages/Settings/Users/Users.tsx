
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Users, Search, UserPlus, CheckCircle, Power,
    X, Save, User, Shield, Mail, Phone, MapPin,
    Briefcase, Building2, Layout, Clock, Activity, MessageSquare
} from '../../../components/Icons';
import { useToast } from '../../../components/Toast';
import { SchemaUserList } from './components/SchemaUserList';
import { userService } from '../../../services/api';

interface UsersSettingsProps {
    onSelectUser?: (user: any) => void;
}

export const UsersSettings = ({ onSelectUser }: UsersSettingsProps) => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [view, setView] = useState<'LIST' | 'EDITOR'>('LIST');
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [selectedUser, setSelectedUser] = useState<any>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users for count:", error);
        }
    };

    const handleCreateUser = () => {
        setSelectedUser(null);
        setView('EDITOR');
    };

    const handleEditUser = (user: any) => {
        if (onSelectUser) {
            onSelectUser(user);
        } else {
            setSelectedUser(user);
            setView('EDITOR');
        }
    };

    const handleSaveUser = async (userData: any) => {
        try {
            // Mock save
            addToast(t("User saved successfully"), 'success');
            setView('LIST');
            loadUsers();
        } catch (error) {
            addToast(t("Failed to save user"), 'error');
        }
    };

    const handleMassUpdate = async (action: 'ACTIVATE' | 'DEACTIVATE') => {
        const newStatus = action === 'ACTIVATE' ? true : false;
        try {
            // Update in UI immediately for responsiveness
            setUsers(prev => prev.map(u => selectedIds.has(u.id) ? { ...u, status: newStatus } : u));
            addToast(`${selectedIds.size} ${t("users updated successfully")}`, 'success');
            setSelectedIds(new Set());
        } catch (error) {
            addToast(t("Failed to update users"), 'error');
        }
    };

    if (view === 'EDITOR') {
        return (
            <div className="h-full overflow-hidden flex flex-col">
                <div className="px-8 py-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('LIST')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
                            <X size={24} />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                {selectedUser ? t("Edit User") : t("Add New User")}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t("Define access and personal details.")}</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                    <div className="max-w-4xl mx-auto text-center py-20">
                        <User size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">{t("User Editor")}</h3>
                        <p className="text-slate-500 max-w-md mx-auto">{t("This module is currently being integrated with the new schema system. Please use the 'Edit' action in the list for full profile management.")}</p>
                        <button onClick={() => setView('LIST')} className="mt-8 px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg font-bold">{t("Back to List")}</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 transition-all">
                <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-300">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Users size={24} className="text-blue-600 dark:text-blue-400" />
                                {t("User Management")}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                {t("Manage system access, roles, and user profiles.")}
                                <span className="font-bold text-slate-700 dark:text-slate-300 ml-2 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
                                    {users.filter(u => u.status).length} {t("Active Users")}
                                </span>
                            </p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <input
                                    type="text"
                                    placeholder={t("Search users...")}
                                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-200"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            </div>
                            <button
                                onClick={handleCreateUser}
                                data-tour="settings-users-add"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 whitespace-nowrap transition-colors"
                            >
                                <UserPlus size={16} /> {t("Add User")}
                            </button>
                        </div>
                    </div>

                    {/* Bulk Actions Toolbar */}
                    {selectedIds.size > 0 && (
                        <div className="mb-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2">
                            <span className="text-sm font-bold text-blue-800 dark:text-blue-300">{selectedIds.size} {t("users selected")}</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleMassUpdate('ACTIVATE')} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 text-xs font-bold rounded border border-slate-200 dark:border-slate-700 hover:border-green-300 transition-colors flex items-center gap-1">
                                    <CheckCircle size={12} /> {t("Activate")}
                                </button>
                                <button onClick={() => handleMassUpdate('DEACTIVATE')} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-red-500 dark:text-red-400 text-xs font-bold rounded border border-slate-200 dark:border-slate-700 hover:border-red-300 transition-colors flex items-center gap-1">
                                    <Power size={12} /> {t("Deactivate")}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Schema User List */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden p-0">
                        <SchemaUserList searchQuery={searchQuery} onSelectUser={handleEditUser} />
                    </div>
                </div>
            </div>
        </div>
    );
};
