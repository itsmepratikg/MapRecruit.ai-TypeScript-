
import React from 'react';
import { Search, Edit2 } from '../../../components/Icons';
import { RECENT_SEARCHES } from '../../../data';

export const RecentSearches = ({ onSearch, onModifySearch }: { onSearch: (t: string) => void, onModifySearch: (t: string) => void }) => {
  return (
    <div className="space-y-3">
      {RECENT_SEARCHES.map(search => (
        <div key={search.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white shadow-sm">
              <Search size={18} />
            </div>
            <div className="flex gap-2">
              {search.terms.map((term, i) => (
                <span key={i} className="px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">
                  {term}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">{search.date}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => onSearch(search.terms.join(' '))}
                className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Re-run Search"
              >
                <Search size={16} />
              </button>
              <button 
                onClick={() => onModifySearch(search.terms.join(' '))}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Modify Search"
              >
                <Edit2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
