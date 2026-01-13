
import React, { useState } from 'react';
import { Lock, Save, X, Eye, EyeOff } from '../../Icons';

interface ComposeNoteProps {
  onSend: (data: { content: string; isPrivate: boolean }) => void;
  onBack: () => void;
}

export const ComposeNote = ({ onSend, onBack }: ComposeNoteProps) => {
  const [body, setBody] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    onSend({ content: body, isPrivate });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Lock size={20} className="text-amber-500" /> Internal Note
          </h3>
        </div>
        <button 
          onClick={handleSend}
          disabled={!body.trim()}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-sm font-bold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save size={16} /> Save
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="relative flex-1">
             <textarea 
              className="w-full h-full p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800 dark:text-slate-200 transition-all resize-none placeholder:text-amber-700/50 dark:placeholder:text-amber-500/50"
              placeholder="Add an internal note about this candidate..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              autoFocus
             />
        </div>
        
        <button 
            onClick={() => setIsPrivate(!isPrivate)}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
            <div className={`p-2 rounded-full ${isPrivate ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                {isPrivate ? <Lock size={16} /> : <Eye size={16} />}
            </div>
            <div className="flex-1 text-left">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {isPrivate ? 'Private Note' : 'Public Note'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isPrivate ? 'Visible only to admins and you.' : 'Visible to all team members.'}
                </p>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isPrivate ? 'border-amber-500 bg-amber-500 text-white' : 'border-slate-300'}`}>
                {isPrivate && <Save size={10} />}
            </div>
        </button>
      </div>
    </div>
  );
};
