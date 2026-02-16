import React from 'react';
import { ArrowLeftRight, Home } from 'lucide-react';

interface ConfirmClientSwitchModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    campaignName: string;
    targetClientName: string;
}

export const ConfirmClientSwitchModal: React.FC<ConfirmClientSwitchModalProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    campaignName,
    targetClientName
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ArrowLeftRight size={32} className="text-indigo-600 dark:text-indigo-400" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Switch Client?</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                        The campaign <span className="font-bold text-slate-800 dark:text-slate-200">"{campaignName}"</span> belongs to <span className="font-bold text-indigo-600 dark:text-indigo-400">{targetClientName}</span>.
                        Would you like to switch your active client to view this campaign?
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={onConfirm}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2"
                        >
                            <ArrowLeftRight size={18} />
                            Switch Client & View
                        </button>

                        <button
                            onClick={onCancel}
                            className="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Home size={18} />
                            Go to Dashboard
                        </button>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
                        Contextual access control enabled
                    </p>
                </div>
            </div>
        </div>
    );
};
