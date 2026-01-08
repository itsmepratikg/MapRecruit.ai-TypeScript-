
import React from 'react';
import { Settings, FileText } from './Icons';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ElementType;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description, 
  icon: Icon = FileText 
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 animate-in fade-in zoom-in duration-300">
      <div className="max-w-2xl text-center">
        <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400 dark:text-slate-500 shadow-sm border border-slate-200 dark:border-slate-700">
          <Icon size={48} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8">
          {description}
        </p>
        <div className="inline-flex gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400">
          <span>Status:</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">Development Placeholder</span>
        </div>
      </div>
    </div>
  );
};
