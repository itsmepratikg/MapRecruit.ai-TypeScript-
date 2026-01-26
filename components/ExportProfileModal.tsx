
import React from 'react';
import { X, FileText, Code, Link, Download } from 'lucide-react';

interface ExportProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateName: string;
}

export const ExportProfileModal = ({ isOpen, onClose, candidateName }: ExportProfileModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Export Profile</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Select an export format for <strong>{candidateName}</strong>.
                    </p>

                    <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group transition-all">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                            <FileText size={20} />
                        </div>
                        <div className="text-left flex-1">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Original Resume (PDF)</h4>
                            <p className="text-xs text-slate-500">Download the source PDF file.</p>
                        </div>
                        <Download size={16} className="text-slate-300 group-hover:text-emerald-600" />
                    </button>

                    <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 group transition-all">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <Code size={20} />
                        </div>
                        <div className="text-left flex-1">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400">Profile Data (JSON)</h4>
                            <p className="text-xs text-slate-500">Structured data schema export.</p>
                        </div>
                        <Download size={16} className="text-slate-300 group-hover:text-blue-600" />
                    </button>

                    <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 group transition-all">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                            <Link size={20} />
                        </div>
                        <div className="text-left flex-1">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-400">Shareable Link</h4>
                            <p className="text-xs text-slate-500">Generate a public view link.</p>
                        </div>
                        <div className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-xs text-slate-500 rounded font-mono group-hover:bg-white">Copy</div>
                    </button>
                </div>
            </div>
        </div>
    );
};
