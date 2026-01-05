
import React from 'react';
import { Settings } from '../../../components/Icons';

interface PlaceholderViewProps {
  title: string;
  description: string;
  icon?: any;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title, description, icon: Icon = Settings }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-6 text-slate-400 dark:text-slate-500 shadow-sm border border-slate-100 dark:border-slate-600">
          <Icon size={40} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">{description}</p>
      <div className="mt-8 flex gap-3">
          <button className="px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm">
              Learn More
          </button>
          <button className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm">
              Configure
          </button>
      </div>
  </div>
);
