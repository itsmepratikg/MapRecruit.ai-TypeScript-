
import React from 'react';
import { Mail, MessageSquare, FileText, ChevronDown, Plus, Eye } from 'lucide-react';

interface TemplateSectionProps {
  label: string;
  type: 'EMAIL' | 'SMS';
  selectedId: string | null;
  onSelect: (id: string) => void;
  color?: string;
  onPreview?: (id: string) => void;
}

const MOCK_TEMPLATES = {
  EMAIL: [
    { id: 't1', name: 'Standard Welcome', subject: 'Welcome to the team process' },
    { id: 't2', name: 'Urgent Action Required', subject: 'Action Needed: Application Status' },
    { id: 't3', name: 'Friendly Introduction', subject: 'Hi there! A quick update.' },
  ],
  SMS: [
    { id: 's1', name: 'Short & Sweet', body: 'Hi {name}, please check your email for next steps.' },
    { id: 's2', name: 'Urgent Reminder', body: 'Reminder: Interview slot pending.' },
  ]
};

export const TemplateSection = ({ label, type, selectedId, onSelect, color = "indigo", onPreview }: TemplateSectionProps) => {
  const templates = type === 'EMAIL' ? MOCK_TEMPLATES.EMAIL : MOCK_TEMPLATES.SMS;
  const selectedTemplate = templates.find(t => t.id === selectedId);
  const Icon = type === 'EMAIL' ? Mail : MessageSquare;

  return (
    <div className={`border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 hover:border-${color}-300 dark:hover:border-${color}-500 transition-colors`}>
      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
            <Icon size={14} />
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">{label}</span>
        </div>
        {selectedId && (
           <button 
             onClick={(e) => { e.stopPropagation(); onPreview && onPreview(selectedId); }}
             className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
           >
             <Eye size={12} /> Preview
           </button>
        )}
      </div>
      
      <div className="p-4">
        {selectedId ? (
          <div className="space-y-3">
             <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedTemplate?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                      {type === 'EMAIL' ? (selectedTemplate as any).subject : (selectedTemplate as any).body}
                    </p>
                </div>
                <button 
                  onClick={() => onSelect('')} 
                  className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 underline"
                >
                  Change
                </button>
             </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
             <div className="relative">
                <select 
                  className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white dark:bg-slate-700 dark:text-slate-200 cursor-pointer"
                  onChange={(e) => onSelect(e.target.value)}
                  value=""
                >
                   <option value="" disabled>Select a template...</option>
                   {templates.map(t => (
                     <option key={t.id} value={t.id}>{t.name}</option>
                   ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
             </div>
             
             <div className="text-center">
                <span className="text-xs text-slate-400">or</span>
             </div>

             <button className="flex items-center justify-center gap-2 w-full py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-md text-slate-500 dark:text-slate-400 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Plus size={14} /> Create New Template
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
