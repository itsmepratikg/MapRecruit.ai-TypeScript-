
import React from 'react';

interface NavItemProps {
    view?: string;
    icon: any;
    label: string;
    activeTab?: boolean;
    onClick?: () => void;
    activeView?: string;
    isCollapsed: boolean;
    noHighlight?: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ 
    view, 
    icon: Icon, 
    label, 
    activeTab, 
    onClick, 
    activeView,
    isCollapsed,
    noHighlight
}) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
        !noHighlight && ((view && activeView === view) || activeTab) 
          ? 'bg-emerald-100 text-emerald-900 font-bold shadow-sm' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
      } ${isCollapsed ? 'justify-center' : ''}`}
      title={isCollapsed ? label : ''}
    >
      <Icon size={20} className={!noHighlight && ((view && activeView === view) || activeTab) ? 'text-emerald-700' : 'text-slate-400 dark:text-slate-500'} />
      <span className={isCollapsed ? 'hidden' : 'block'}>{label}</span>
    </button>
);
