
import React, { useState } from 'react';
import { Eye, History, Bookmark } from '../../../components/Icons';
import { RecentlyVisitedProfiles } from './RecentlyVisitedProfiles';
import { RecentSearches } from './RecentSearches';
import { SavedSearches } from './SavedSearches';

export const LandingDashboard: React.FC<{ onSearch: (t: string) => void, onModifySearch: (t: string) => void }> = ({ onSearch, onModifySearch }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const toggleTab = (tab: string) => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex border-b border-gray-100 dark:border-slate-700">
        <button 
          onClick={() => toggleTab('recent_visits')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors border-b-2 ${activeTab === 'recent_visits' ? 'text-green-600 dark:text-green-400 border-green-600 dark:border-green-400 bg-green-50/50 dark:bg-green-900/20' : 'text-gray-500 dark:text-slate-400 border-transparent hover:bg-gray-50 dark:hover:bg-slate-700'}`}
        >
          <Eye size={16} /> Recently Visited Profiles
        </button>
        <button 
          onClick={() => toggleTab('recent_searches')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors border-b-2 ${activeTab === 'recent_searches' ? 'text-green-600 dark:text-green-400 border-green-600 dark:border-green-400 bg-green-50/50 dark:bg-green-900/20' : 'text-gray-500 dark:text-slate-400 border-transparent hover:bg-gray-50 dark:hover:bg-slate-700'}`}
        >
          <History size={16} /> Recent Searches
        </button>
        <button 
          onClick={() => toggleTab('saved_searches')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors border-b-2 ${activeTab === 'saved_searches' ? 'text-green-600 dark:text-green-400 border-green-600 dark:border-green-400 bg-green-50/50 dark:bg-green-900/20' : 'text-gray-500 dark:text-slate-400 border-transparent hover:bg-gray-50 dark:hover:bg-slate-700'}`}
        >
          <Bookmark size={16} /> Saved Searches
        </button>
      </div>

      {activeTab && (
        <div className="p-6 min-h-[300px] animate-in fade-in zoom-in-95 duration-200">
          {activeTab === 'recent_visits' && <RecentlyVisitedProfiles />}
          {activeTab === 'recent_searches' && <RecentSearches onSearch={onSearch} onModifySearch={onModifySearch} />}
          {activeTab === 'saved_searches' && <SavedSearches onSearch={onSearch} onModifySearch={onModifySearch} />}
        </div>
      )}
    </div>
  );
};
