
import React, { useState } from 'react';
import { MapPin, User, Sparkles } from '../../components/Icons';
import { TalentAssistantSidePanel } from './components/TalentAssistantSidePanel';

export const LocalProfiles = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <MapPin size={20} className="text-red-500" />
                    Local Profiles
                </h2>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded hidden sm:inline-block">Location: <strong>Hyderabad, India</strong></span>
                    <button 
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${isChatOpen ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                    >
                        <Sparkles size={16} />
                        <span className="hidden sm:inline">Assistant</span>
                    </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {/* Mock Content for Local Profiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Local Candidate {i}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Software Engineer</p>
                                    <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                                        <MapPin size={10} /> <span>{(i * 2.5).toFixed(1)} miles away</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Talent Assistant Sidebar */}
        <TalentAssistantSidePanel 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
            initialMessage="I can help you find candidates near your registered location. What specifically are you looking for?"
        />
    </div>
  );
};
