import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { campaignService } from '../../../services/api';
import SchemaTable from '../../../components/Schema/SchemaTable';
import { useToast } from '../../../components/Toast';
import {
    ChevronDown, Search, Plus, RefreshCw, MoreVertical,
    ChevronRight, Heart, Network, ArrowUpDown, Briefcase
} from '../../../components/Icons';
import { StatusBadge } from '../../../components/Common';

import { HoverMenu } from '../../../components/Campaign/HoverMenu';

export const SchemaCampaignList = ({ status, onNavigateToCampaign, onTabChange, onCreateCampaign }: any) => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        try {
            setLoading(true);
            const data = await campaignService.getAll();
            setCampaigns(data);
        } catch (error) {
            console.error(error);
            addToast(t("Failed to load campaigns"), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleMenuAction = (campaign: any, action: string) => {
        // Ensure campaign has an 'id' for navigation
        const campWithId = { ...campaign, id: campaign._id?.$oid || campaign._id || campaign.id };

        if (action === 'INTELLIGENCE') onNavigateToCampaign(campWithId, 'Intelligence');
        else if (action === 'SOURCE_AI' || action === 'ATTACH_PEOPLE') onNavigateToCampaign(campWithId, 'Source AI:ATTACH');
        else if (action === 'ATTACHED_PROFILES') onNavigateToCampaign(campWithId, 'Source AI:PROFILES');
        else if (action === 'INTEGRATIONS') onNavigateToCampaign(campWithId, 'Source AI:INTEGRATIONS');
        else if (action === 'JOB_DESC') onNavigateToCampaign(campWithId, 'Source AI:JD');
        else if (action === 'MATCH_AI') onNavigateToCampaign(campWithId, 'Match AI');
        else if (action === 'ENGAGE_AI' || action === 'ENGAGE_CANDIDATES') onNavigateToCampaign(campWithId, 'Engage AI:TRACKING');
        else if (action === 'ENGAGE_WORKFLOW') onNavigateToCampaign(campWithId, 'Engage AI:BUILDER');
        else if (action === 'ENGAGE_INTERVIEW') onNavigateToCampaign(campWithId, 'Engage AI:ROOM');
    };

    const filteredCampaigns = campaigns.filter(c => {
        // Strict status mapping based on MongoDB data structure
        const cStatus = c.schemaConfig?.mainSchema?.status ||
            (c.status === 'Archived' ? 'Archived' :
                (c.status === true || c.status === 'Active' ? 'Active' : 'Closed'));

        // Ensure requested status matches accurately
        if (cStatus !== status) return false;

        const name = c.schemaConfig?.mainSchema?.title || c.title || '';
        const jobID = c.migrationMeta?.jobID || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase()) || jobID.includes(searchQuery);
    });

    const columns = [
        {
            header: t('Title'),
            accessor: (item: any) => (
                <div className="flex items-center gap-3 group/row">
                    <div className="relative inline-block group/title">
                        <button
                            className="font-medium text-blue-600 dark:text-blue-400 hover:underline text-left block max-w-[220px] truncate"
                            onClick={() => onNavigateToCampaign({ ...item, id: item._id?.$oid || item._id || item.id }, 'Intelligence')}
                        >
                            {item.schemaConfig?.mainSchema?.title || item.title || t('Untitled Campaign')}
                        </button>
                        <HoverMenu
                            campaign={item}
                            onAction={(action) => handleMenuAction(item, action)}
                        />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                        <Heart size={14} className="text-gray-400 hover:text-red-500 cursor-pointer" />
                        <Network size={14} className="text-gray-400 hover:text-emerald-500 cursor-pointer" />
                    </div>
                </div>
            )
        },
        {
            header: t('Job ID'),
            accessor: (item: any) => <span className="text-gray-500 font-mono">{item.migrationMeta?.jobID || '---'}</span>
        },
        {
            header: t('Owner'),
            accessor: (item: any) => (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        {item.schemaConfig?.mainSchema?.ownerID?.[0]?.slice(-2).toUpperCase() || 'Me'}
                    </div>
                </div>
            )
        },
        {
            header: t('Status'),
            accessor: (item: any) => <StatusBadge status={item.schemaConfig?.mainSchema?.status || (item.status === 'Archived' ? 'Archived' : (item.status === true || item.status === 'Active' ? 'Active' : 'Closed'))} />
        },
        {
            header: t('Created'),
            accessor: (item: any) => (
                <span className="text-gray-400 text-xs">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '---'}
                </span>
            )
        }
    ];

    if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">{t("Loading Campaigns...")}</div>;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-visible">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-800 gap-4">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <Briefcase size={20} className="text-emerald-500" />
                        {t(status)} {t("Campaigns")}
                    </h3>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder={t("Search by title or job ID...")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:outline-none focus:border-emerald-500 dark:text-slate-200 transition-all shadow-sm"
                        />
                        <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                    </div>

                    <button
                        onClick={loadCampaigns}
                        className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                        title={t("Refresh")}
                    >
                        <RefreshCw size={18} />
                    </button>

                    <button
                        onClick={onCreateCampaign}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        <span>{t("Create Campaign")}</span>
                    </button>

                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>

            <div className="p-0 overflow-visible">
                <SchemaTable
                    data={filteredCampaigns}
                    columns={columns}
                    title={`${status} ${t("Campaigns")}`}
                />
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/10 text-[10px] text-slate-400 flex justify-between">
                <span>{t("Showing")} {filteredCampaigns.length} {t("campaigns")}</span>
                <span className="flex items-center gap-1"><ChevronDown size={10} /> {t("Table Settings")}</span>
            </div>
        </div>
    );
};
