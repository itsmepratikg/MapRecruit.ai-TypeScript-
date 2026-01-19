import React, { useState, useEffect } from 'react';
import { userService } from '../../../../services/api';
import SchemaTable from '../../../../components/Schema/SchemaTable';
import { useToast } from '../../../../components/Toast';
import { useTranslation } from 'react-i18next';

export const SchemaUserList = ({ searchQuery, onSelectUser }: any) => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error(error);
            // Fallback to empty or toast
            // addToast("Failed to load users", "error"); 
            // Commented out to prevent annoying toast if backend not running perfectly or empty
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u => {
        const name = u.name || u.email || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const columns = [
        {
            header: t('Name'),
            accessor: (item: any) => {
                const initials = ((item.firstName?.[0] || '') + (item.lastName?.[0] || '')).toUpperCase() || '?';
                return (
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-indigo-500 shadow-sm`}>
                            {initials}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'N/A'}</span>
                            <span className="text-[10px] text-slate-400 capitalize">{item.jobTitle || t('No Title')}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            header: t('Email'),
            accessor: 'email'
        },
        {
            header: t('Role'),
            accessor: (item: any) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${item.role === 'Product Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                    item.role === 'Admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                    {item.role || t('User')}
                </span>
            )
        },
        {
            header: t('Last Active'),
            accessor: (item: any) => item.lastActiveAt ? new Date(item.lastActiveAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : t('Never')
        },
        {
            header: t('Logins'),
            accessor: (item: any) => (
                <div className="flex items-center gap-1">
                    <span className="font-medium">{item.loginCount || 0}</span>
                </div>
            )
        },
        {
            header: t('Status'),
            accessor: (item: any) => (
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.status ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                    <span className={item.status ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}>
                        {item.status ? t('Active') : t('Inactive')}
                    </span>
                </div>
            )
        }
    ];

    if (loading) return <div className="p-8 text-center text-slate-500">{t("Loading Users...")}</div>;

    return (
        <SchemaTable
            data={filteredUsers}
            columns={columns}
            title={t("Users")}
            onEdit={onSelectUser}
        />
    );
};
