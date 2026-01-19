
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, X, ChevronRight, Briefcase, User, Settings,
  LayoutDashboard, FileText, CornerDownLeft, Tag, Folder,
  Users, Shield, Globe, Layout, Building2
} from './Icons';
import { GLOBAL_CAMPAIGNS, MOCK_PROFILES } from '../data';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (type: string, data?: any) => void;
}

type SearchResult = {
  id: string | number;
  type: 'CAMPAIGN' | 'CANDIDATE' | 'NAV';
  title: string;
  subtitle?: string;
  icon: any;
  payload?: any;
};

export const GlobalSearch = ({ isOpen, onClose, onNavigate }: GlobalSearchProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const STATIC_ACTIONS: SearchResult[] = useMemo(() => [
    { id: 'home', title: t('Dashboard'), subtitle: t('Go to Home'), type: 'NAV', payload: { view: 'DASHBOARD' }, icon: LayoutDashboard },
    { id: 'metrics', title: t('Metrics'), subtitle: t('Analytics & Reports'), type: 'NAV', payload: { view: 'METRICS' }, icon: FileText },
    { id: 'prof_search', title: t('Search Profiles'), subtitle: t('Candidate Search'), type: 'NAV', payload: { view: 'PROFILES', subView: 'SEARCH' }, icon: Search },
    { id: 'prof_folders', title: t('Folders'), subtitle: t('Manage Candidate Folders'), type: 'NAV', payload: { view: 'PROFILES', subView: 'FOLDERS' }, icon: Folder },
    { id: 'prof_tags', title: t('Tags'), subtitle: t('Manage Global Tags'), type: 'NAV', payload: { view: 'PROFILES', subView: 'TAGS' }, icon: Tag },
    { id: 'set_company', title: t('Company Settings'), subtitle: t('Company Info'), type: 'NAV', payload: { view: 'SETTINGS', settingsTab: 'COMPANY_INFO' }, icon: Building2 },
    { id: 'set_users', title: t('User Management'), subtitle: t('Manage Team Members'), type: 'NAV', payload: { view: 'SETTINGS', settingsTab: 'USERS' }, icon: Users },
    { id: 'set_roles', title: t('Roles & Permissions'), subtitle: t('Access Control'), type: 'NAV', payload: { view: 'SETTINGS', settingsTab: 'ROLES' }, icon: Shield },
    { id: 'set_layout', title: t('ReachOut Layouts'), subtitle: t('Customize Interface'), type: 'NAV', payload: { view: 'SETTINGS', settingsTab: 'REACHOUT_LAYOUTS' }, icon: Layout },
    { id: 'my_account', title: t('My Account'), subtitle: t('Personal Settings'), type: 'NAV', payload: { view: 'MY_ACCOUNT' }, icon: User },
  ], [t]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Search Logic
  const results = useMemo(() => {
    // If empty, show navigation items
    if (!query.trim()) return STATIC_ACTIONS;

    const lowerQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // 1. Navigation
    STATIC_ACTIONS.forEach(item => {
      if (item.title.toLowerCase().includes(lowerQuery) || item.subtitle?.toLowerCase().includes(lowerQuery)) {
        searchResults.push(item);
      }
    });

    // 2. Campaigns
    GLOBAL_CAMPAIGNS.forEach(c => {
      if (c.name.toLowerCase().includes(lowerQuery) || c.jobID.includes(query)) {
        searchResults.push({
          id: `camp-${c.id}`,
          type: 'CAMPAIGN',
          title: c.name,
          subtitle: `${t('Campaign')} • ${c.jobID} • ${c.status}`,
          icon: Briefcase,
          payload: c
        });
      }
    });

    // 3. Candidates
    MOCK_PROFILES.forEach(p => {
      if (p.name.toLowerCase().includes(lowerQuery) || p.title.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: `cand-${p.id}`,
          type: 'CANDIDATE',
          title: p.name,
          subtitle: `${t('Candidate')} • ${p.title} • ${p.location}`, // 'Candidate' key might need addition or reuse 'Profile'
          icon: User,
          payload: p
        });
      }
    });

    return searchResults.slice(0, 15); // Limit to 15 results for performance
  }, [query, STATIC_ACTIONS, t]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        // Scroll into view logic could be added here if needed
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelect = (result: SearchResult) => {
    onNavigate(result.type, result.payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Window */}
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col relative z-10 animate-in zoom-in-95 duration-200">

        {/* Search Input */}
        <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-700">
          <Search size={20} className="text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search campaigns, candidates, pages..."
            className="flex-1 bg-transparent text-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-bold px-2">
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2" ref={listRef}>
          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-900/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${isSelected
                        ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold ${isSelected
                          ? 'text-emerald-950 dark:text-emerald-100' // Darker text in light mode, Lighter in dark mode
                          : 'text-slate-700 dark:text-slate-200'
                          }`}>
                          {item.title}
                        </h4>
                        <p className={`text-xs ${isSelected
                          ? 'text-emerald-700 dark:text-emerald-300' // Improved contrast
                          : 'text-slate-500 dark:text-slate-400'
                          }`}>
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <CornerDownLeft size={16} className="text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <p>{t("No results found for")} "{query}"</p>
            </div>
          )}
        </div>

        {/* Footer Hints */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider">
          <div className="flex gap-4">
            <span>↑↓ {t("Navigate")}</span>
            <span>↵ {t("Select")}</span>
          </div>
          <div>
            {t("MapRecruit Search")}
          </div>
        </div>
      </div>
    </div>
  );
};
