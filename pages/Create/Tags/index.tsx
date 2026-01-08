
import React, { useState } from 'react';
import { ApplicationTag } from './ApplicationTag';
import { ProfileTag } from './ProfileTag';

export const TagsWrapper = () => {
  const [view, setView] = useState<'APP' | 'PROFILE'>('APP');

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-center p-4">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button onClick={() => setView('APP')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${view === 'APP' ? 'bg-white dark:bg-slate-600 shadow text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>Application Tags</button>
            <button onClick={() => setView('PROFILE')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${view === 'PROFILE' ? 'bg-white dark:bg-slate-600 shadow text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>Profile Tags</button>
        </div>
      </div>
      <div className="flex-1">
        {view === 'APP' ? <ApplicationTag /> : <ProfileTag />}
      </div>
    </div>
  );
};
