import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import { useCandidateProfile } from '../hooks/useCandidateProfile';

interface ResumePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    resumeID: string | null;
}

export const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({ isOpen, onClose, resumeID }) => {
    const { profile, loading, error } = useCandidateProfile(resumeID);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    useEffect(() => {
        if (profile) {
            // Attempt to find the resume file URL from various potential fields
            // adjusting based on actual schema
            const url = profile.resume?.fileUrl ||
                profile.resume?.originalPdfUrl ||
                profile.fileUrl ||
                profile.resumeUrl ||
                null;
            setFileUrl(url);

            if (!url) {
                console.log("Resume URL not found in profile:", profile);
            }
        }
    }, [profile]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen || !resumeID) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                                {loading ? 'Loading Resume...' : (profile?.profile?.fullName || 'Candidate Resume')}
                            </h3>
                            {!loading && fileUrl && (
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    PDF Document Ready
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {fileUrl && (
                            <a
                                href={fileUrl}
                                download
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                                title="Download"
                            >
                                <Download size={20} />
                            </a>
                        )}
                        {fileUrl && (
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                                title="Open in New Tab"
                            >
                                <ExternalLink size={20} />
                            </a>
                        )}
                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 transition-colors rounded-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-slate-100 dark:bg-slate-950/50 p-4 overflow-hidden relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                                <p className="text-slate-500 font-medium">Fetching contents...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center max-w-md">
                                <p className="text-red-500 font-bold mb-2">Failed to load resume</p>
                                <p className="text-slate-500 text-sm">{error}</p>
                            </div>
                        </div>
                    ) : fileUrl ? (
                        <iframe
                            src={fileUrl}
                            className="w-full h-full rounded-lg shadow-sm bg-white"
                            title="Resume Preview"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm max-w-md">
                                <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                                <h4 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">No Resume Document Found</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                                    This candidate profile does not appear to have an attached PDF or document URL.
                                </p>
                                <button onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                    Close Preview
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
