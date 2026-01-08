
import React, { useState, useMemo } from 'react';
import { Search, Share2, Edit2, Trash2, ArrowUpDown } from '../../../components/Icons';
import { SAVED_SEARCHES } from '../../../data';

export const SavedSearches = ({ onSearch, onModifySearch }: { onSearch: (t: string) => void, onModifySearch: (t: string) => void }) => {
  const [sortOption, setSortOption] = useState('name');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortedSavedSearches = useMemo(() => {
    return [...SAVED_SEARCHES].sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        // @ts-ignore
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [sortOption]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              <ArrowUpDown size={14} /> Sort: {sortOption === 'name' ? 'Name' : 'Created Date'}
            </button>
            
            {isSortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)}></div>
                <div className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-20 overflow-hidden">
                  <button 
                    onClick={() => { setSortOption('name'); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 ${sortOption === 'name' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-slate-300'}`}
                  >
                    Name (A-Z)
                  </button>
                  <button 
                    onClick={() => { setSortOption('date'); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 ${sortOption === 'date' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-slate-300'}`}
                  >
                    Created Date
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <input type="text" placeholder="Filter by name..." className="pl-8 pr-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg text-xs w-48 outline-none focus:border-green-500 bg-white dark:bg-slate-800 dark:text-slate-200" />
            <Search size={12} className="absolute left-2.5 top-2 text-gray-400" />
          </div>
        </div>
        <button className="text-xs text-gray-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 font-medium">Clear Filters</button>
      </div>

      {sortedSavedSearches.map(saved => (
        <div key={saved.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-slate-800 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white shadow-sm">
              <Search size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-gray-800 dark:text-slate-200">{saved.name}</h4>
                {saved.shared && <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800 flex items-center gap-1"><Share2 size={8} /> Shared</span>}
              </div>
              <div className="flex gap-2 mt-1">
                {saved.tags.map((tag, i) => (
                  <span key={i} className="text-xs text-purple-600 dark:text-purple-300 border border-purple-100 dark:border-purple-800 px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30">{tag}</span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onSearch(saved.tags.join(' '))}
              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Run Search"
            >
              <Search size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Share">
              <Share2 size={16} />
            </button>
            <button 
              onClick={() => onModifySearch(saved.tags.join(' '))}
              className="p-2 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors" title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
