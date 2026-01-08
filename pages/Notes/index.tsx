
import React, { useState } from 'react';
import { CampaignNotes } from './CampaignNotes';
import { CandidateNotes } from './CandidateNotes';
import { UserNotes } from './UserNotes';
import { FileText } from '../../components/Icons';

export const NotesModule = () => {
  const [activeTab, setActiveTab] = useState('USER');

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
       <div className="flex items-center gap-4 p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
          <div className="flex items-center gap-2 mr-4 text-slate-800 dark:text-slate-100 font-bold">
             <FileText size={20} className="text-yellow-500" />
             <span>Notes</span>
          </div>
          <button onClick={() => setActiveTab('USER')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === 'USER' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>My Notes</button>
          <button onClick={() => setActiveTab('CANDIDATE')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === 'CANDIDATE' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>Candidate</button>
          <button onClick={() => setActiveTab('CAMPAIGN')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === 'CAMPAIGN' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>Campaign</button>
       </div>
       <div className="flex-1 overflow-hidden">
          {activeTab === 'USER' && <UserNotes />}
          {activeTab === 'CANDIDATE' && <CandidateNotes />}
          {activeTab === 'CAMPAIGN' && <CampaignNotes />}
       </div>
    </div>
  );
};
