
import React, { useState } from 'react';
import { MessageSquare, Send, X, Hash } from '../../Icons';

interface ComposeSMSProps {
  onSend: (data: { content: string }) => void;
  onBack: () => void;
}

export const ComposeSMS = ({ onSend, onBack }: ComposeSMSProps) => {
  const [body, setBody] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    onSend({ content: body });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare size={20} className="text-green-500" /> New SMS
          </h3>
        </div>
        <button 
          onClick={handleSend}
          disabled={!body.trim()}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-bold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send size={16} /> Send
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="relative flex-1">
             <textarea 
              className="w-full h-full p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-slate-800 dark:text-slate-200 transition-all resize-none"
              placeholder="Type your SMS message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              autoFocus
             />
             <div className="absolute bottom-3 right-3 text-xs font-bold text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 shadow-sm">
                {body.length} chars
             </div>
        </div>
        
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Use Template</span>
            <button className="text-xs text-green-600 dark:text-green-400 font-bold hover:underline flex items-center gap-1">
                <Hash size={12} /> Browse
            </button>
        </div>
      </div>
    </div>
  );
};
