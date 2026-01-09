
import React from 'react';
import { Briefcase, Lock, Archive } from '../../../components/Icons';

export const CampaignStats = ({ activeTab, onTabChange, counts }: { activeTab: string, onTabChange: (tab: string) => void, counts: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div 
      onClick={() => onTabChange('Active')}
      className={`p-6 rounded-xl shadow-sm border cursor-pointer transition-all ${activeTab === 'Active' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-white dark:bg-slate-800' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100">{counts.active}</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Active Campaigns</p>
        </div>
        <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-xl">
          <Briefcase size={32} className="text-gray-400 dark:text-slate-400" />
        </div>
      </div>
    </div>
    <div 
      onClick={() => onTabChange('Closed')}
      className={`p-6 rounded-xl shadow-sm border cursor-pointer transition-all ${activeTab === 'Closed' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-white dark:bg-slate-800' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-green-500">{counts.closed}</h2>
          <p className="text-sm text-green-600 font-medium">Closed Campaigns</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl">
          <Lock size={32} className="text-green-600 dark:text-green-400" />
        </div>
      </div>
    </div>
    <div 
      onClick={() => onTabChange('Archived')}
      className={`p-6 rounded-xl shadow-sm border cursor-pointer transition-all ${activeTab === 'Archived' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-white dark:bg-slate-800' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-green-700 dark:text-green-500">{counts.archived}</h2>
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">Archived Campaigns</p>
        </div>
        <div className="bg-green-500 p-4 rounded-xl">
          <Archive size={32} className="text-white" />
        </div>
      </div>
    </div>
  </div>
);
