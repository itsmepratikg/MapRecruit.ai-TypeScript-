import React, { useState } from 'react';
import { Users, Lock, Globe, X } from 'lucide-react';

interface WorkflowShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    sharedWith: {
        accessLevel: 'Global' | 'Team' | 'Private';
        users?: string[];
        teams?: string[];
    };
    onSave: (sharedWith: any) => void;
}

export const WorkflowShareModal: React.FC<WorkflowShareModalProps> = ({ isOpen, onClose, sharedWith, onSave }) => {
    const [accessLevel, setAccessLevel] = useState(sharedWith?.accessLevel || 'Private');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ accessLevel });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Share Workflow</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X size={20} /></button>
                </div>

                <div className="space-y-3 mb-6">
                    <button
                        onClick={() => setAccessLevel('Private')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${accessLevel === 'Private' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
                    >
                        <div className={`p-2 rounded-full ${accessLevel === 'Private' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Lock size={18} />
                        </div>
                        <div className="text-left">
                            <h4 className={`font-bold text-sm ${accessLevel === 'Private' ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>Private</h4>
                            <p className="text-xs text-slate-500">Only you can view and edit this workflow.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setAccessLevel('Team')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${accessLevel === 'Team' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
                    >
                        <div className={`p-2 rounded-full ${accessLevel === 'Team' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Users size={18} />
                        </div>
                        <div className="text-left">
                            <h4 className={`font-bold text-sm ${accessLevel === 'Team' ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>Team Access</h4>
                            <p className="text-xs text-slate-500">Visible to everyone in your team/company.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setAccessLevel('Global')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${accessLevel === 'Global' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
                    >
                        <div className={`p-2 rounded-full ${accessLevel === 'Global' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Globe size={18} />
                        </div>
                        <div className="text-left">
                            <h4 className={`font-bold text-sm ${accessLevel === 'Global' ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>Global Template</h4>
                            <p className="text-xs text-slate-500">Available as a starting template for all users.</p>
                        </div>
                    </button>
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-colors">Save Settings</button>
                </div>
            </div>
        </div>
    );
};
