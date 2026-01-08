
import React, { useState } from 'react';
import { Copy, FileText, CheckCircle } from '../../../components/Icons';
import { PlaceholderPage } from '../../../components/PlaceholderPage';

export const DuplicateProfiles = () => {
  const [activeTab, setActiveTab] = useState<'IDENTIFIED' | 'MERGED'>('IDENTIFIED');

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
       <div className="flex items-center gap-4 p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
          <div className="flex items-center gap-2 mr-4 text-slate-800 dark:text-slate-100 font-bold">
             <Copy size={20} className="text-orange-500" />
             <span>Duplicate Profiles</span>
          </div>
          <button onClick={() => setActiveTab('IDENTIFIED')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === 'IDENTIFIED' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>Identified Duplicates</button>
          <button onClick={() => setActiveTab('MERGED')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === 'MERGED' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>Recently Merged</button>
       </div>
       <div className="flex-1 overflow-hidden">
          {activeTab === 'IDENTIFIED' ? (
             <PlaceholderPage 
               title="Identified Duplicates" 
               description="Review and resolve profiles that have been flagged as potential duplicates by the system." 
               icon={FileText} 
             />
          ) : (
             <PlaceholderPage 
               title="Recently Merged" 
               description="History of duplicate profiles that have been successfully merged." 
               icon={CheckCircle} 
             />
          )}
       </div>
    </div>
  );
};
