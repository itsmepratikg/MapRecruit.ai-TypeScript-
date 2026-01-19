import React, { useState, useEffect } from 'react';
import { campaignService } from '../../../services/api';
import SchemaTable from '../../../components/Schema/SchemaTable';
import { useToast } from '../../../components/Toast';
import { ChevronDown, Search, Filter } from '../../../components/Icons';

// Reusing the StatusBadge from Common (assuming import path is correct based on CampaignTable)
import { StatusBadge } from '../../../components/Common';

export const SchemaCampaignList = ({ status, onNavigateToCampaign, onTabChange }: any) => {
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
            addToast("Failed to load campaigns", "error");
        } finally {
            setLoading(false);
        }
    };

    const filteredCampaigns = campaigns.filter(c => {
        // Filter by Status (assuming schema structure uses 'status' or 'schema.mainSchema.status')
        // My Campaign Model puts 'status' at root (boolean) AND 'schema.mainSchema.status' (String)
        // Let's use the string one strictly for now if present, asking for "Active"/"Closed"
        const cStatus = c.schema?.mainSchema?.status || (c.status ? 'Active' : 'Closed');
        if (cStatus !== status) return false;

        // Search
        const name = c.schema?.mainSchema?.title || c.title || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const columns = [
        {
            header: 'Title',
            accessor: (item: any) => (
                <div
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    onClick={() => onNavigateToCampaign(item, 'Intelligence')}
                >
                    {item.schema?.mainSchema?.title || item.title || 'Untitled Campaign'}
                </div>
            )
        },
        {
            header: 'Owner',
            accessor: (item: any) => item.ownerId?.[0] || 'Me'
        },
        {
            header: 'Status',
            accessor: (item: any) => <StatusBadge status={item.schema?.mainSchema?.status || (item.status ? 'Active' : 'Closed')} />
        },
        {
            header: 'Created',
            accessor: (item: any) => new Date(item.createdAt).toLocaleDateString()
        }
        // Add more columns as needed matching the Schema
    ];

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Campaigns...</div>;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
            {/* Toolbar - Simplified for MVP */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{status} Campaigns (Schema)</h3>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 pr-4 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:outline-none focus:border-emerald-500 dark:text-slate-200"
                        />
                        <Search size={14} className="absolute left-2.5 top-3 text-slate-400" />
                    </div>
                    <button onClick={loadCampaigns} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-emerald-600">
                        Refresh
                    </button>
                </div>
            </div>

            <div className="p-0">
                <SchemaTable
                    data={filteredCampaigns}
                    columns={columns}
                    title={`${status} Campaigns`}
                />
            </div>
        </div>
    );
};
