import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Lock, Building2, User, X, ChevronDown, 
  Search, Plus, Check, Trash2, Shield, Link
} from './Icons';
import { AccessSettings, AccessLevel, ShareRule } from '../types';
import { MOCK_USERS_LIST } from '../data';
import { useToast } from './Toast';

interface AccessControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string; // e.g., "Folder: Q3 Hiring"
  currentSettings?: AccessSettings;
  onSave: (settings: AccessSettings) => void;
  currentUser: { id: string; name: string };
}

const LEVEL_OPTIONS = [
  { id: 'PRIVATE', label: 'Restricted', desc: 'Only added people can access', icon: Lock },
  { id: 'CLIENT', label: 'Client Level', desc: 'Anyone in this client can view', icon: Building2 },
  { id: 'COMPANY', label: 'Company Level', desc: 'Anyone in the organization can view', icon: Globe },
];

// Mock Data for demonstration
const MOCK_INITIAL_SHARES: ShareRule[] = [
    {
        entityId: 'usr_101',
        entityName: 'Sarah Jenkins',
        entityType: 'USER',
        avatar: 'SJ',
        role: 'Recruiter',
        permission: 'EDIT'
    },
    {
        entityId: 'usr_102',
        entityName: 'Mike Ross',
        entityType: 'USER',
        avatar: 'MR',
        role: 'Hiring Manager',
        permission: 'VIEW'
    },
    {
        entityId: 'usr_105',
        entityName: 'Vinay Kashyap',
        entityType: 'USER',
        avatar: 'VK',
        role: 'Admin',
        permission: 'VIEW'
    }
];

// Custom Dropdown Component
const PermissionDropdown = ({ 
    value, 
    onChange 
}: { 
    value: 'VIEW' | 'EDIT', 
    onChange: (val: 'VIEW' | 'EDIT') => void 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val: 'VIEW' | 'EDIT') => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors focus:outline-none"
            >
                {value === 'VIEW' ? 'Can view' : 'Can edit'}
                <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <button 
                        onClick={() => handleSelect('VIEW')}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between transition-colors ${value === 'VIEW' ? 'text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                        Can view
                        {value === 'VIEW' && <Check size={12} className="text-emerald-600" />}
                    </button>
                    <button 
                        onClick={() => handleSelect('EDIT')}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between transition-colors ${value === 'EDIT' ? 'text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                        Can edit
                        {value === 'EDIT' && <Check size={12} className="text-emerald-600" />}
                    </button>
                </div>
            )}
        </div>
    );
};

export const AccessControlModal = ({ 
  isOpen, 
  onClose, 
  entityName, 
  currentSettings, 
  onSave,
  currentUser
}: AccessControlModalProps) => {
  const { addToast } = useToast();
  
  // Default State with Mock Data
  const defaultState: AccessSettings = {
    level: 'PRIVATE',
    ownerId: currentUser.id,
    sharedWith: MOCK_INITIAL_SHARES // Pre-populate with mock data
  };

  const [settings, setSettings] = useState<AccessSettings>(currentSettings || defaultState);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);

  // Sync prop changes
  useEffect(() => {
    if (isOpen) {
        // If currentSettings is provided, use it, otherwise use defaultState (which now has mocks)
        setSettings(currentSettings || defaultState);
        setSearchQuery('');
    }
  }, [isOpen, currentSettings]);

  if (!isOpen) return null;

  const handleLevelChange = (level: AccessLevel) => {
    setSettings(prev => ({ ...prev, level }));
    setShowLevelDropdown(false);
  };

  const handleAddUser = (user: typeof MOCK_USERS_LIST[0]) => {
    // Check if already added
    if (settings.sharedWith.some(s => s.entityId === user.id)) {
        addToast("User already added", "info");
        return;
    }

    const newRule: ShareRule = {
        entityId: user.id,
        entityName: user.name,
        entityType: 'USER',
        avatar: user.initials,
        permission: 'VIEW', // Default to View
        role: user.role
    };

    setSettings(prev => ({
        ...prev,
        sharedWith: [...prev.sharedWith, newRule]
    }));
    setSearchQuery('');
  };

  const handleRemoveUser = (userId: string) => {
    setSettings(prev => ({
        ...prev,
        sharedWith: prev.sharedWith.filter(s => s.entityId !== userId)
    }));
  };

  const handlePermissionChange = (userId: string, newPerm: 'VIEW' | 'EDIT') => {
    setSettings(prev => ({
        ...prev,
        sharedWith: prev.sharedWith.map(s => s.entityId === userId ? { ...s, permission: newPerm } : s)
    }));
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
    addToast("Sharing settings updated", "success");
  };

  const handleCopyLink = () => {
    const domain = window.location.origin;
    // Hardcoded ID and dynamic 'from' parameter as requested
    const link = `${domain}/v5/folder/694b92500dd57d37d1f216db?from=metricfolder`;
    
    navigator.clipboard.writeText(link).then(() => {
        addToast("Link copied to clipboard", "success");
    }).catch(() => {
        addToast("Failed to copy link", "error");
    });
  };

  // Filter users for search (exclude current user and already added users)
  const searchResults = MOCK_USERS_LIST.filter(u => 
    u.id !== currentUser.id && 
    !settings.sharedWith.some(s => s.entityId === u.id) &&
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const CurrentLevelIcon = LEVEL_OPTIONS.find(l => l.id === settings.level)?.icon || Lock;

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] min-h-[550px]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Share "{entityName}"</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage who can view or edit this item.</p>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Content Body with Large Bottom Padding for Dropdowns */}
        <div className="p-6 flex-1 overflow-y-auto pb-40">
            
            {/* User Search Input */}
            <div className="mb-6 relative">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Add people by name or email..." 
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 dark:text-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                </div>

                {/* Search Dropdown Results */}
                {searchQuery && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                        {searchResults.length > 0 ? searchResults.map(user => (
                            <button 
                                key={user.id}
                                onClick={() => handleAddUser(user)}
                                className="w-full px-4 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${user.color}`}>
                                        {user.initials}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{user.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                    </div>
                                </div>
                                <Plus size={16} className="text-slate-400" />
                            </button>
                        )) : (
                            <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">No users found</div>
                        )}
                    </div>
                )}
            </div>

            {/* Access List */}
            <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">People with access</h4>
                
                {/* 1. General Access Rule (The dropdown) */}
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                            <CurrentLevelIcon size={18} />
                        </div>
                        <div className="relative">
                            <button 
                                onClick={() => setShowLevelDropdown(!showLevelDropdown)}
                                className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            >
                                {LEVEL_OPTIONS.find(l => l.id === settings.level)?.label} <ChevronDown size={12} />
                            </button>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {LEVEL_OPTIONS.find(l => l.id === settings.level)?.desc}
                            </p>

                            {/* Level Dropdown */}
                            {showLevelDropdown && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowLevelDropdown(false)} />
                                    <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden">
                                        {LEVEL_OPTIONS.map(opt => (
                                            <button 
                                                key={opt.id}
                                                onClick={() => handleLevelChange(opt.id as AccessLevel)}
                                                className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${settings.level === opt.id ? 'bg-slate-50 dark:bg-slate-700/50' : ''}`}
                                            >
                                                <opt.icon size={16} className={`mt-0.5 ${settings.level === opt.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                                                <div>
                                                    <p className={`text-sm font-medium ${settings.level === opt.id ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'}`}>{opt.label}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</p>
                                                </div>
                                                {settings.level === opt.id && <Check size={14} className="ml-auto text-emerald-600 dark:text-emerald-400 mt-1" />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium px-2">Can view</span>
                </div>

                {/* 2. Owner */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                            {currentUser.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{currentUser.name} (You)</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Owner</p>
                        </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium px-2">Owner</span>
                </div>

                {/* 3. Specific Shares */}
                {settings.sharedWith.map(rule => (
                    <div key={rule.entityId} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold">
                                {rule.avatar || rule.entityName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{rule.entityName}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{rule.role || 'User'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Custom Permission Dropdown */}
                            <PermissionDropdown 
                                value={rule.permission}
                                onChange={(newPerm) => handlePermissionChange(rule.entityId, newPerm)}
                            />
                            
                            <button 
                                onClick={() => handleRemoveUser(rule.entityId)}
                                className="text-slate-400 hover:text-red-500 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
            <button 
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
                <Link size={14} /> Copy link
            </button>
            <button 
                onClick={handleSave}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
            >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};