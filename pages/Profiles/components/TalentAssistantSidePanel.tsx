
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X } from '../../../components/Icons';
import { ChatBubble } from '../../../components/Common';

interface TalentAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export const TalentAssistantSidePanel = ({ 
  isOpen, 
  onClose, 
  initialMessage = "I'm here to help you analyze these profiles. What are you looking for?" 
}: TalentAssistantProps) => {
  const [chatMessages, setChatMessages] = useState<any[]>([
      { id: 1, text: initialMessage }
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
        text: "I'm analyzing the data based on your request. Filtering profiles...",
        suggestions: [
           { label: "Show High Match Candidates", action: () => console.log("Filter High Match") }
        ]
      }]);
    }, 1000);
  };

  return (
    <aside className={`${isOpen ? 'w-80 md:w-96 border-l' : 'w-0 border-l-0'} bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 flex flex-col shrink-0 z-20 shadow-xl transition-all duration-300 ease-in-out overflow-hidden`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 min-w-[320px]">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-sm"><Sparkles size={16} /></div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Talent Assistant</h3>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">AI Profile Analysis</p>
                </div>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X size={18} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 space-y-4 custom-scrollbar min-w-[320px]">
            {chatMessages.map((msg: any, idx: number) => (
                <ChatBubble key={idx} message={msg} isBot={!msg.text.includes("Filter") && idx % 2 === 0} />
            ))}
            <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 min-w-[320px]">
            <form onSubmit={handleChatInput} className="relative">
                <input 
                    name="chatInput" 
                    type="text" 
                    placeholder="Ask about these profiles..." 
                    className="w-full bg-slate-100 dark:bg-slate-700 text-sm rounded-xl pl-4 pr-12 py-3 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-200" 
                />
                <button type="submit" className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <Send size={16} />
                </button>
            </form>
        </div>
    </aside>
  );
};
