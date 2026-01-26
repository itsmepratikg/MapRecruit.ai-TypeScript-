
import React from 'react';
import { X } from 'lucide-react';

export const LocalMatchAnalysisModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Match Analysis</h2>
                    <button onClick={onClose}><X size={20} className="text-slate-500" /></button>
                </div>
                <div className="text-center text-slate-500 py-8">
                    Analysis Details Placeholder
                </div>
            </div>
        </div>
    );
};
