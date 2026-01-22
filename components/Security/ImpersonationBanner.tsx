import React, { useEffect, useState } from 'react';
import { useImpersonation } from '../../context/ImpersonationContext';
import { createPortal } from 'react-dom';

export const ImpersonationBanner = () => {
    const { isImpersonating, targetUser, mode, stopImpersonation } = useImpersonation();

    if (!isImpersonating || !targetUser) return null;

    return createPortal(
        <div className="fixed top-0 left-0 right-0 h-10 bg-amber-500 text-white z-[9999] flex items-center justify-between px-4 shadow-md animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-4 text-sm font-medium">
                <span className="bg-white/20 px-2 py-0.5 rounded text-xs uppercase tracking-wider font-bold">
                    {mode === 'read-only' ? 'VIEW ONLY' : 'FULL ACCESS'}
                </span>
                <span>
                    Viewing as: <strong>{targetUser.firstName} {targetUser.lastName}</strong> ({targetUser.email})
                </span>
            </div>
            <button
                onClick={stopImpersonation}
                className="bg-black/20 hover:bg-black/40 text-xs font-bold px-3 py-1 rounded transition-colors uppercase tracking-wide"
            >
                Exit Impersonation
            </button>
        </div>,
        document.body
    );
};

export const SafetyRequestModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [requestDetails, setRequestDetails] = useState<{ method: string, url: string } | null>(null);

    useEffect(() => {
        const handleTrigger = (e: any) => {
            const { method, url } = e.detail;
            setRequestDetails({ method, url });
            setIsOpen(true);
        };

        window.addEventListener('TRIGGER_IMPERSONATION_SAFETY_MODAL', handleTrigger);
        return () => window.removeEventListener('TRIGGER_IMPERSONATION_SAFETY_MODAL', handleTrigger);
    }, []);

    if (!isOpen) return null;

    const handleConfirm = () => {
        window.dispatchEvent(new Event('SAFETY_MODAL_CONFIRM'));
        setIsOpen(false);
    };

    const handleCancel = () => {
        window.dispatchEvent(new Event('SAFETY_MODAL_CANCEL'));
        setIsOpen(false);
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl max-w-md w-full p-6 border-2 border-amber-500">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Impersonation Warning</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        You are about to modify data while impersonating another user.
                        <br /><br />
                        <strong>Action:</strong> <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">{requestDetails?.method}</span>
                        <span className="font-mono text-xs ml-1 text-slate-500">{requestDetails?.url}</span>
                        <br /><br />
                        This action will be audited under your Admin ID.
                    </p>

                    <div className="flex w-full gap-3">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md font-medium transition-colors"
                        >
                            Confirm & Proceed
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
