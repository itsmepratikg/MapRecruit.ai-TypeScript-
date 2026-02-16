import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pin, ChevronRight, Activity, User, Building2, Loader2, BarChart2 } from '../Icons';
import { HistoryItem } from '../../hooks/useRecentItems';
import { campaignService } from '../../services/api';
// Dynamically import to avoid circles if needed, though safe here usually
// import { candidateService } from '../../services/api'; 

interface SmartPinCardProps {
    item: HistoryItem;
    onUnpin: (item: HistoryItem) => void;
    onClick: (url: string) => void;
}

export const SmartPinCard = ({ item, onUnpin, onClick }: SmartPinCardProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleMouseEnter = () => {
        // Optional: Auto-open on hover?
        // setIsOpen(true);
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    // Fetch Data on Open
    useEffect(() => {
        if (isOpen && !details && !loading && item.metadata?.entityId) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    if (item.type === 'CAMPAIGN') {
                        // Fetch Campaign Stats or Details
                        // Assuming getCampaign or getStats exists. 
                        // Using getStats(id) might return global stats, let's try getting specific campaign if possible
                        // Or just use the generic 'get' if available. 
                        // For now, let's try to fetch all and find (cached usually) or implement specific endpoint
                        // Actually, let's just mock/simulate for now if specific ID fetch isn't exposed in service, 
                        // but campaignService usually has getById or similar. 
                        // Looking at campaignService usage in App.tsx: campaignService.getAll() is used.
                        // Let's use getAll and find for now to be safe, or if there's a lightweight 'get(id)'
                        const all = await campaignService.getAll();
                        const found = all.find((c: any) => (c._id?.$oid || c._id) === item.metadata.entityId);
                        if (found) setDetails(found);
                        else setError(true);
                    } else if (item.type === 'PROFILE') {
                        // Fetch Profile
                        // const profile = await candidateService.getOne(item.metadata.entityId);
                        // setDetails(profile);
                        // Skipping for now as candidateService might not be imported or set up same way
                        setDetails({ note: "Profile Preview" });
                    }
                } catch (err) {
                    console.error("SmartPin fetch failed", err);
                    setError(true);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [isOpen, item, details, loading]);

    // Render Content based on Type
    const renderDetails = () => {
        if (loading) return <div className="p-4 flex justify-center"><Loader2 size={16} className="text-indigo-500" /></div>;
        if (error) return <div className="p-2 text-xs text-red-400 italic">Could not load details</div>;
        if (!details) return null;

        if (item.type === 'CAMPAIGN') {
            return (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 text-xs space-y-2 animate-in slide-in-from-top-1">
                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Status:</span>
                        <span className={`font-bold ${details.status === 'Active' ? 'text-emerald-600' : 'text-slate-600'}`}>
                            {details.status || 'Unknown'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Job ID:</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">{details.passcode || '---'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-center">
                            <div className="font-bold text-indigo-600">{details.stats?.total || 0}</div>
                            <div className="text-[9px] text-slate-400">Candidates</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-emerald-600">{details.stats?.interviewed || 0}</div>
                            <div className="text-[9px] text-slate-400">Interviewed</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-orange-600">{details.stats?.pending || 0}</div>
                            <div className="text-[9px] text-slate-400">Pending</div>
                        </div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClick(item.url + '/analytics'); }}
                        className="w-full mt-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <BarChart2 size={12} /> View Analytics
                    </button>
                    <div className="text-[9px] text-slate-300 dark:text-slate-600 text-center pt-1">
                        ID: {item.metadata.entityId.slice(-6)}
                    </div>
                </div>
            );
        }

        if (item.type === 'PROFILE') {
            return (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 text-xs text-center text-slate-500 italic">
                    Quick preview available soon for Profiles.
                </div>
            );
        }

        return <div className="p-2 text-xs text-slate-400">No additional details</div>;
    };

    const getIcon = () => {
        switch (item.type) {
            case 'CAMPAIGN': return <Activity size={14} className="text-blue-500" />;
            case 'PROFILE': return <User size={14} className="text-emerald-500" />;
            case 'ACCOUNT': return <User size={14} className="text-slate-500" />;
            default: return <Activity size={14} className="text-slate-400" />;
        }
    };

    return (
        <div className="border border-transparent hover:border-slate-100 dark:hover:border-slate-700 rounded-lg overflow-hidden transition-all mb-1">
            <div className={`flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer group`} onClick={() => onClick(item.url)}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                        {getIcon()}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{item.title}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{item.type.toLowerCase()}</span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {/* Smart Toggle */}
                    {item.metadata?.entityId && (
                        <button
                            onClick={handleToggle}
                            className={`p-1 rounded-md transition-colors ${isOpen ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600' : 'text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-500'}`}
                            title="Quick View"
                        >
                            <ChevronRight size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                        </button>
                    )}

                    {/* Unpin */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onUnpin(item); }}
                        className="p-1 text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"
                        title="Unpin"
                    >
                        <Pin size={12} className="fill-current" />
                    </button>
                </div>
            </div>

            {/* Smart Details Area */}
            {isOpen && (
                <div className="border-t border-slate-100 dark:border-slate-700">
                    {renderDetails()}
                </div>
            )}
        </div>
    );
};
