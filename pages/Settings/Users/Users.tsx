
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Plus, Search, Edit2, ChevronLeft,
    CheckCircle, XCircle, MoreHorizontal, Mail, Phone,
    Filter, Trash2, Shield, Calendar, UserPlus, Power
} from '../../../components/Icons';
import { useToast } from '../../../components/Toast';
import { BasicDetails } from '../../MyAccount/BasicDetails';
import { SchemaUserList } from './components/SchemaUserList';
import { MOCK_USERS_LIST } from '../../../data';

// Extended Mock Data for Users Table
const USERS_DATA = [
    ...MOCK_USERS_LIST.map(u => ({
        ...u,
        mobile: '+1 (555) 012-3456', // Mock mobile
        createdDate: 'Jan 15, 2024',
        updatedDate: 'May 20, 2025',
        status: 'Active' as 'Active' | 'Inactive'
    })),
    {
        id: 'usr_106', name: 'Emily Clark', role: 'Recruiter', email: 'emily.c@maprecruit.ai',
        avatar: null, initials: 'EC', color: 'bg-pink-100 text-pink-700',
        mobile: '+1 (555) 987-6543', createdDate: 'Feb 10, 2024', updatedDate: 'Apr 05, 2025', status: 'Inactive'
    },
    {
        id: 'usr_107', name: 'Robert Fox', role: 'Hiring Manager', email: 'robert.f@maprecruit.ai',
        avatar: null, initials: 'RF', color: 'bg-teal-100 text-teal-700',
        mobile: '+1 (555) 456-7890', createdDate: 'Mar 22, 2024', updatedDate: 'May 12, 2025', status: 'Active'
    }
];

interface UsersSettingsProps {
    onSelectUser?: (user: any) => void;
}

export const UsersSettings = ({ onSelectUser }: UsersSettingsProps) => {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [view, setView] = useState<'LIST' | 'CREATE'>('LIST');
    const [users, setUsers] = useState(USERS_DATA);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Local state for CREATE mode only (Edit is handled globally)
    const [newUser, setNewUser] = useState<any>(null);

    // --- Handlers ---
    const handleEditUser = (user: any) => {
        // Use MongoDB _id for navigation if available
        const userId = user._id || user.id || 'new';
        navigate(`/settings/Users/userprofile/basicdetails/${userId}`);
    };

    const handleCreateUser = () => {
        // Initialize empty user
        setNewUser({
            firstName: '', lastName: '', email: '', phone: '',
            role: 'Recruiter', status: 'Active', color: 'Blue',
            countryCode: 'US', jobTitle: '', location: '', activeClient: ''
        });
        setView('CREATE');
    };

    const handleSaveUser = (userData: any) => {
        // Create Logic
        const createdUser = {
            ...userData,
            id: `usr_${Date.now()}`,
            name: `${userData.firstName} ${userData.lastName}`,
            initials: (userData.firstName[0] + userData.lastName[0]).toUpperCase(),
            createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Active'
        };
        setUsers(prev => [...prev, createdUser]);
        addToast(`User ${createdUser.name} created successfully`, 'success');

        setView('LIST');
        setNewUser(null);
    };

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredUsers.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredUsers.map(u => u.id)));
        }
    };

    const handleMassUpdate = (action: 'ACTIVATE' | 'DEACTIVATE') => {
        const newStatus = action === 'ACTIVATE' ? 'Active' : 'Inactive';
        setUsers(prev => prev.map(u => selectedIds.has(u.id) ? { ...u, status: newStatus } : u));
        addToast(`${selectedIds.size} users updated to ${newStatus}`, 'success');
        setSelectedIds(new Set());
    };

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        const lower = searchQuery.toLowerCase();
        return users.filter(u =>
            u.name.toLowerCase().includes(lower) ||
            u.email.toLowerCase().includes(lower) ||
            u.role.toLowerCase().includes(lower)
        );
    }, [users, searchQuery]);

    // --- RENDER: CREATE VIEW ---
    if (view === 'CREATE') {
        return (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <BasicDetails
                    userOverride={newUser}
                    onSaveOverride={handleSaveUser}
                    onBack={() => setView('LIST')}
                />
            </div>
        );
    }

    // --- RENDER: LIST VIEW ---
    return (
        <div className="p-8 lg:p-12 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="max-w-7xl mx-auto w-full">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <Users size={24} className="text-blue-600 dark:text-blue-400" />
                            User Management
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Manage system access, roles, and user profiles.
                            <span className="font-bold text-slate-700 dark:text-slate-300 ml-2 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
                                {users.filter(u => u.status === 'Active').length} Active Users
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="Search users..."
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
                            <UserPlus size={16} /> Add User
                        </button>
                    </div>
                </div>

                {/* Bulk Actions Toolbar */}
                {selectedIds.size > 0 && (
                    <div className="mb-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2">
                        <span className="text-sm font-bold text-blue-800 dark:text-blue-300">{selectedIds.size} users selected</span>
                        <div className="flex gap-2">
                            <button onClick={() => handleMassUpdate('ACTIVATE')} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 text-xs font-bold rounded border border-slate-200 dark:border-slate-700 hover:border-green-300 transition-colors flex items-center gap-1">
                                <CheckCircle size={12} /> Activate
                            </button>
                            <button onClick={() => handleMassUpdate('DEACTIVATE')} data-tour="settings-users-deactivate" className="px-3 py-1.5 bg-white dark:bg-slate-800 text-red-500 dark:text-red-400 text-xs font-bold rounded border border-slate-200 dark:border-slate-700 hover:border-red-300 transition-colors flex items-center gap-1">
                                <Power size={12} /> Deactivate
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
    );
};
