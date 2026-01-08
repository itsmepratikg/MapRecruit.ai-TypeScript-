
import React, { useState } from 'react';
import { MyEvents } from './MyEvents';
import { CandidateAvailability } from './CandidateAvailability';
import { UpcomingEvents } from './UpcomingEvents';
import { RemindersWrapper } from './Reminders';

export const CalendarModule = () => {
  const [activeTab, setActiveTab] = useState('EVENTS');

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
       <div className="flex gap-2 p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 overflow-x-auto">
          <button onClick={() => setActiveTab('EVENTS')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'EVENTS' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>My Events</button>
          <button onClick={() => setActiveTab('AVAILABILITY')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'AVAILABILITY' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>Availability</button>
          <button onClick={() => setActiveTab('UPCOMING')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'UPCOMING' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>Upcoming</button>
          <button onClick={() => setActiveTab('REMINDERS')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'REMINDERS' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>Reminders</button>
       </div>
       <div className="flex-1 overflow-hidden">
          {activeTab === 'EVENTS' && <MyEvents />}
          {activeTab === 'AVAILABILITY' && <CandidateAvailability />}
          {activeTab === 'UPCOMING' && <UpcomingEvents />}
          {activeTab === 'REMINDERS' && <RemindersWrapper />}
       </div>
    </div>
  );
};
