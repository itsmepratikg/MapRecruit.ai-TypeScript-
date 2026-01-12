
import React, { useState } from 'react';
import { ChevronLeft, Brain, Search, GitBranch, MessageCircle, ThumbsUp, Settings } from '../Icons';
import { NavItem } from './NavItem';
import { useScreenSize } from '../../hooks/useScreenSize';

interface CampaignsMenuProps {
    selectedCampaign: any;
    activeCampaignTab: string;
    setActiveCampaignTab: (tab: string) => void;
    onBack: () => void;
    isCollapsed: boolean;
    setIsSidebarOpen: (v: boolean) => void;
}

export const CampaignsMenu = ({
    selectedCampaign,
    activeCampaignTab,
    setActiveCampaignTab,
    onBack,
    isCollapsed,
    setIsSidebarOpen
}: CampaignsMenuProps) => {
    const { isDesktop } = useScreenSize();

    return (
        <div className="animate-in slide-in-from-left duration-300 ease-out">
            <button 
                onClick={onBack}
                className={`w-full flex items-center gap-2 px-3 py-2 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                title="Back to Campaigns"
            >
                <ChevronLeft size={14} /> <span className={isCollapsed ? 'hidden' : 'inline'}>Back to Campaigns</span>
            </button>
            
            <div className={`px-3 mb-6 ${isCollapsed ? 'hidden' : 'block'}`}>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">{selectedCampaign?.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">ID: {selectedCampaign?.jobID}</p>
            </div>

            <div className="space-y-1">
                <NavItem 
                    icon={Brain} 
                    label="Intelligence" 
                    activeTab={activeCampaignTab === 'Intelligence'} 
                    onClick={() => { setActiveCampaignTab('Intelligence'); if (!isDesktop) setIsSidebarOpen(false); }}
                    isCollapsed={isCollapsed}
                />
                
                {/* Source AI Group */}
                <div>
                    <NavItem 
                        icon={Search} 
                        label="Source AI" 
                        activeTab={activeCampaignTab.startsWith('Source AI')} 
                        onClick={() => { setActiveCampaignTab('Source AI'); if (!isDesktop) setIsSidebarOpen(false); }} 
                        isCollapsed={isCollapsed}
                    />
                    {activeCampaignTab.startsWith('Source AI') && !isCollapsed && (
                        <div className="ml-8 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-700 pl-3 animate-in slide-in-from-left-2 duration-200">
                            <button onClick={() => { setActiveCampaignTab('Source AI:ATTACH'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeCampaignTab === 'Source AI:ATTACH' || activeCampaignTab === 'Source AI' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                Attach People
                            </button>
                            <button onClick={() => { setActiveCampaignTab('Source AI:PROFILES'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeCampaignTab === 'Source AI:PROFILES' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                Attached Profiles
                            </button>
                            <button onClick={() => { setActiveCampaignTab('Source AI:INTEGRATIONS'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeCampaignTab === 'Source AI:INTEGRATIONS' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                Integrations
                            </button>
                            <button onClick={() => { setActiveCampaignTab('Source AI:JD'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeCampaignTab === 'Source AI:JD' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                Job Description
                            </button>
                        </div>
                    )}
                </div>

                <NavItem 
                    icon={GitBranch} 
                    label="Match AI" 
                    activeTab={activeCampaignTab === 'Match AI'} 
                    onClick={() => { setActiveCampaignTab('Match AI'); if (!isDesktop) setIsSidebarOpen(false); }}
                    isCollapsed={isCollapsed}
                />
                
                {/* Engage AI Group */}
                <div>
                    <NavItem 
                        icon={MessageCircle} 
                        label="Engage AI" 
                        activeTab={activeCampaignTab.startsWith('Engage AI')} 
                        onClick={() => { setActiveCampaignTab('Engage AI'); if (!isDesktop) setIsSidebarOpen(false); }} 
                        isCollapsed={isCollapsed}
                    />
                    {activeCampaignTab.startsWith('Engage AI') && !isCollapsed && (
                        <div className="ml-8 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-700 pl-3 animate-in slide-in-from-left-2 duration-200">
                            <button onClick={() => { setActiveCampaignTab('Engage AI:BUILDER'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeCampaignTab === 'Engage AI:BUILDER' || activeCampaignTab === 'Engage AI' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                Workflow Builder
                            </button>
                            <button onClick={() => { setActiveCampaignTab('Engage AI:ROOM'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeCampaignTab === 'Engage AI:ROOM' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                Interview Panel
                            </button>
                            <button onClick={() => { setActiveCampaignTab('Engage AI:TRACKING'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeCampaignTab === 'Engage AI:TRACKING' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                Candidate List
                            </button>
                        </div>
                    )}
                </div>

                <NavItem 
                    icon={ThumbsUp} 
                    label="Recommended" 
                    activeTab={activeCampaignTab === 'Recommended Profiles'} 
                    onClick={() => { setActiveCampaignTab('Recommended Profiles'); if (!isDesktop) setIsSidebarOpen(false); }}
                    isCollapsed={isCollapsed}
                />

                <NavItem 
                    icon={Settings} 
                    label="Settings" 
                    activeTab={activeCampaignTab === 'Settings'} 
                    onClick={() => { setActiveCampaignTab('Settings'); if (!isDesktop) setIsSidebarOpen(false); }}
                    isCollapsed={isCollapsed}
                />
            </div>
        </div>
    );
};
