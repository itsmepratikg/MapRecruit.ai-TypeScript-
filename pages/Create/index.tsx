
import React, { useState } from 'react';
import { CreateProfile } from './Profile';
import { CreateCampaign } from './Campaign';
import { TagsWrapper } from './Tags';
import { Folders } from './Folders';
import { CreateTemplates } from './Templates';
import { PlusCircle } from '../../components/Icons';

export const CreateModule = () => {
  const [activeTab, setActiveTab] = useState('PROFILE');

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
       <div className="flex items-center gap-4 p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-2 mr-4 text-slate-800 dark:text-slate-100 font-bold">
             <PlusCircle size={20} className="text-emerald-500" />
             <span>Create New</span>
          </div>
          <button onClick={() => setActiveTab('PROFILE')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'PROFILE' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>Profile</button>
          <button onClick={() => setActiveTab('CAMPAIGN')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'CAMPAIGN' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>Campaign</button>
          <button onClick={() => setActiveTab('TAGS')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'TAGS' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>Tags</button>
          <button onClick={() => setActiveTab('FOLDERS')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'FOLDERS' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>Folders</button>
          <button onClick={() => setActiveTab('TEMPLATES')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'TEMPLATES' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>Templates</button>
       </div>
       <div className="flex-1 overflow-hidden">
          {activeTab === 'PROFILE' && <CreateProfile />}
          {activeTab === 'CAMPAIGN' && <CreateCampaign />}
          {activeTab === 'TAGS' && <TagsWrapper />}
          {activeTab === 'FOLDERS' && <Folders />}
          {activeTab === 'TEMPLATES' && <CreateTemplates />}
       </div>
    </div>
  );
};
