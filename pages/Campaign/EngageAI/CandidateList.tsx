
import React, { useState } from 'react';
import { 
  Search, MapPin, CheckCircle, Clock, User, FileText, Mail
} from '../../../components/Icons';
import { MOCK_CANDIDATES_CAMPAIGN } from '../../../data';

export const CandidateList = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(MOCK_CANDIDATES_CAMPAIGN[0]);

  const steps = [
    { label: "Announcement", status: "completed" },
    { label: "Screening (Basic)", status: "completed" },
    { label: "Tech Quiz", status: "completed" },
    { label: "Interview (System Design)", status: "active" },
    { label: "Offer", status: "locked" }
  ];

  return (
    <div className="flex h-full bg-white dark:bg-slate-900 transition-colors">
      <div className="w-80 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-200" 
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {MOCK_CANDIDATES_CAMPAIGN.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelectedCandidate(c)}
              className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors group ${selectedCandidate.id === c.id ? 'bg-white dark:bg-slate-800 border-l-4 border-l-indigo-600 shadow-sm' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${selectedCandidate.id === c.id ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-slate-300 dark:group-hover:bg-slate-600'}`}>
                  {c.avatar}
                </div>
                <div className="min-w-0">
                  <h4 className={`font-bold text-sm truncate ${selectedCandidate.id === c.id ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>{c.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.role}</p>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                 <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">{c.stage}</span>
                 <span className="text-[10px] text-slate-400">2h ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
         <div className="p-8 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedCandidate.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2"><MapPin size={14}/> San Francisco, CA • {selectedCandidate.role}</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">View Profile</button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">Review & Advance</button>
                </div>
            </div>

            {/* Horizontal Stepper */}
            <div className="relative flex items-center justify-between px-4 pb-4">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-100 dark:bg-slate-700 -z-10"></div>
                {steps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center bg-white dark:bg-slate-900 px-4 transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 transition-all ${
                            step.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                            step.status === 'active' ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 shadow-lg scale-110' :
                            'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600'
                        }`}>
                            {step.status === 'completed' ? <CheckCircle size={16}/> : <span className="text-xs font-bold">{i + 1}</span>}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${step.status === 'active' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>{step.label}</span>
                    </div>
                ))}
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-900/50 space-y-6 custom-scrollbar">
            {/* Active Action Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-indigo-900 shadow-sm overflow-hidden transition-colors">
                <div className="bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/30 dark:to-slate-800 px-6 py-4 border-b border-indigo-50 dark:border-indigo-900/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"></span>
                        <h3 className="font-bold text-indigo-900 dark:text-indigo-200">Current Round: System Design Interview</h3>
                    </div>
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs px-2 py-1 rounded font-medium border border-yellow-200 dark:border-yellow-800">Pending Feedback</span>
                </div>
                <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300"><User size={24}/></div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Interviewer: John Doe (Engineering Manager)</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1"><Clock size={12}/> Scheduled for Today, 2:00 PM - 3:00 PM</p>
                            <div className="mt-2 flex gap-2">
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500 dark:text-slate-300">Video Call</span>
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500 dark:text-slate-300">Live Coding</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-slate-50 dark:border-slate-700">
                        <button className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-colors">Launch Interview Room</button>
                        <button className="flex-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">Nudge Interviewer</button>
                    </div>
                </div>
            </div>

            {/* History */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Completed Rounds</h3>
                <div className="space-y-3">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg"><FileText size={18}/></div>
                            <div>
                                <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Tech Quiz (React)</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Score: 88/100 • Automated</p>
                            </div>
                        </div>
                        <span className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full border border-green-100 dark:border-green-800">Passed</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg"><Mail size={18}/></div>
                            <div>
                                <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Initial Announcement</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Sent on Oct 12 • Opened</p>
                            </div>
                        </div>
                        <span className="text-slate-400 text-xs hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">View Email</span>
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};
