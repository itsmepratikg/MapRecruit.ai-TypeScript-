
import React, { useState } from 'react';
import { Mail, Send, X, Paperclip } from '../../Icons';

interface ComposeEmailProps {
  onSend: (data: { content: string; subject: string }) => void;
  onBack: () => void;
}

export const ComposeEmail = ({ onSend, onBack }: ComposeEmailProps) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || !subject.trim()) return;
    onSend({ content: body, subject });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Mail size={20} className="text-blue-500" /> New Email
          </h3>
        </div>
        <button 
          onClick={handleSend}
          disabled={!body.trim() || !subject.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send size={16} /> Send
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar p-1">
        <div className="space-y-1">
           <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Subject</label>
           <input 
            type="text" 
            placeholder="e.g. Follow up on interview..." 
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-800 dark:text-slate-200 transition-all"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            autoFocus
           />
        </div>

        <div className="space-y-1 flex-1 flex flex-col">
           <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Message</label>
           <div className="flex-1 relative">
             <textarea 
              className="w-full h-full p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-800 dark:text-slate-200 transition-all resize-none"
              placeholder="Write your email here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
             />
             <div className="absolute bottom-3 right-3 flex gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                    <Paperclip size={18} />
                </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
