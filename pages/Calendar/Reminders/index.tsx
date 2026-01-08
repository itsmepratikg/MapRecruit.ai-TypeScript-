
import React, { useState } from 'react';
import { UpcomingReminder } from './UpcomingReminder';
import { PastReminder } from './PastReminder';

export const RemindersWrapper = () => {
  const [view, setView] = useState<'UPCOMING' | 'PAST'>('UPCOMING');

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6">
        <button 
          onClick={() => setView('UPCOMING')}
          className={`py-4 px-4 text-sm font-bold border-b-2 transition-colors ${view === 'UPCOMING' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setView('PAST')}
          className={`py-4 px-4 text-sm font-bold border-b-2 transition-colors ${view === 'PAST' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
        >
          Past (24h)
        </button>
      </div>
      <div className="flex-1">
        {view === 'UPCOMING' ? <UpcomingReminder /> : <PastReminder />}
      </div>
    </div>
  );
};
