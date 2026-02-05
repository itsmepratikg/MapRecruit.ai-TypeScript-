
import React from 'react';
import { History, Link, Upload, User, CheckCircle, FileText, Settings, Calendar, Briefcase, Paperclip, Mail } from '../../../components/Icons';
import { useActivities } from '../../../hooks/useActivities';
import { useParams } from 'react-router-dom';
import { sanitizeActivityHtml, getActivityActorName } from '../../../utils/activityUtils';
import { Activity } from '../../../types/Activity';


export const ActivityLog = () => {
    const { id: campaignID } = useParams<{ id: string }>();

    // Get Company ID
    const getUserCompanyID = () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                return user.currentCompanyID || user.companyID || user.companyId;
            }
        } catch (e) { console.error(e); }
        return undefined;
    };
    const companyID = getUserCompanyID();

    const { activities, loading, error } = useActivities({
        campaignID, // If campaignID is present, hook attempts to filter by it
        limit: 50
    });

    // Strict Client-Side Filter
    const filteredActivities = activities.filter(act => {
        if (companyID && act.companyID !== companyID) return false;
        if (campaignID && act.campaignID && !act.campaignID.includes(campaignID)) return false;
        return true;
    });

    if (loading) return <div className="p-8 text-center text-slate-500">Loading activities...</div>;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-full overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <History size={18} className="text-blue-500" /> Recent Activity
                </h3>
                <div className="flex gap-2">
                    <button className="text-xs text-slate-500 hover:text-blue-600 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded">Filter</button>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Export</button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {filteredActivities.length === 0 && (
                    <div className="text-center text-slate-500 text-sm py-4">No recent activity found for this campaign.</div>
                )}
                {/* We want to group by date if possible, but for now simple list is acceptable or simple grouping logic needed. 
            The mock data `CAMPAIGN_ACTIVITIES` was grouped. Let's stick to flat list for MVP refactor or simple group. 
            Flat list with date headers is nice but let's just do flat list with timestamps first to ensure data works. 
        */}
                <div className="relative pl-6 border-l border-slate-200 dark:border-slate-700 space-y-6">
                    {filteredActivities.map((act: Activity, idx: number) => {
                        const date = new Date(act.activityAt || act.createdAt);
                        const htmlContent = sanitizeActivityHtml(act.activity?.campaignActivity || act.activity?.commonActivity);
                        const actorName = getActivityActorName(act);

                        return (
                            <div key={act._id || idx} className="relative">
                                <div className={`absolute -left-[31px] top-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${idx === 0 ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>

                                <div className="flex gap-4 group p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                    <div className="mt-1 p-2 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shadow-sm text-slate-500">
                                        {act.activityIcon ? (
                                            <i className={act.activityIcon} aria-hidden="true" style={{ fontSize: '14px' }}></i>
                                        ) : (
                                            <CheckCircle size={14} className="text-slate-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        {htmlContent ? (
                                            <div
                                                className="text-sm text-slate-800 dark:text-slate-200 prose prose-sm max-w-none dark:prose-invert"
                                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                                            />
                                        ) : (
                                            <>
                                                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{act.activityType}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                                                    <span>by <span className="font-medium text-slate-700 dark:text-slate-300">{actorName}</span></span>
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono whitespace-nowrap">
                                        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

