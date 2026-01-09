
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Sparkles, Send, X, User } from '../../components/Icons';
import { ChatBubble } from '../../components/Common';

export const LocalProfiles = () => {
  const [chatMessages, setChatMessages] = useState<any[]>([
      { id: 1, text: "I can help you find candidates near your registered location (Hyderabad). What specifically are you looking for?" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleChatInput = (e: any) => {
    e.preventDefault();
    const input = e.target.elements.chatInput.value;
    if (!input.trim()) return;

    setChatMessages(prev => [...prev, { text: input }]);
    e.target.reset();

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        text: "I'm updating the local search parameters to prioritize candidates within 20 miles matching those skills.",
        suggestions: [
           { label: "Expand Radius to 50 miles", action: () => console.log("Expand") }
        ]
      }]);
    }, 1000);
  };

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <MapPin size={20} className="text-red-500" />
                    Local Profiles
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Based on your location: <strong>Hyderabad, India</strong></span>
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
        <aside className="w-80 md:w-96 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col shrink-0 z-20 shadow-xl">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-sm"><Sparkles size={16} /></div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Talent Assistant</h3>
                        <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">Local Search Specialist</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 space-y-4 custom-scrollbar">
                {chatMessages.map((msg: any, idx: number) => (
                    <ChatBubble key={idx} message={msg} isBot={!msg.text.includes("Expand") && idx % 2 === 0} />
                ))}
                <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <form onSubmit={handleChatInput} className="relative">
                    <input 
                        name="chatInput" 
                        type="text" 
                        placeholder="Refine local search..." 
                        className="w-full bg-slate-100 dark:bg-slate-700 text-sm rounded-xl pl-4 pr-12 py-3 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-200" 
                    />
                    <button type="submit" className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </aside>
    </div>
  );
};
