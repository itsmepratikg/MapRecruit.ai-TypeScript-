
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GitBranch, Plus, Trash2, Edit2, Search, Building2 } from '../../components/Icons';
import api from '../../services/api';
import { useToast } from '../../components/Toast';

export const FranchiseSettings = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [franchises, setFranchises] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchFranchises = async () => {
            try {
                const response = await api.get('/company/franchises');
                setFranchises(response.data);
            } catch (error) {
                console.error('Failed to fetch franchises:', error);
                // Mock data if API fails to show UI
                setFranchises([
                    { _id: '1', franchiseName: 'East Coast Group', clientIDs: [] },
                    { _id: '2', franchiseName: 'West Coast Partners', clientIDs: [] }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchFranchises();
    }, []);

    const filteredFranchises = franchises.filter(f =>
        f.franchiseName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12">
                <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t("Franchise Management")}</h3>
                            <p className="text-slate-500 dark:text-slate-400">{t("Group clients into franchises for structured management.")}</p>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-95">
                            <Plus size={18} />
                            {t("Create Franchise")}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-4">
                                <div className="relative flex-1">
                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder={t("Search franchises...")}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                {loading ? (
                                    <div className="p-12 text-center text-slate-400 animate-pulse">{t("Loading franchises...")}</div>
                                ) : filteredFranchises.length > 0 ? (
                                    filteredFranchises.map(franchise => (
                                        <div key={franchise._id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                                    <GitBranch className="text-indigo-600 dark:text-indigo-400" size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{franchise.franchiseName}</h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                        <Building2 size={14} />
                                                        {franchise.clientIDs?.length || 0} {t("Clients Assigned")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center">
                                        <GitBranch size={48} className="mx-auto text-slate-200 mb-4" />
                                        <p className="text-slate-400 font-medium">{t("No franchises found")}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
