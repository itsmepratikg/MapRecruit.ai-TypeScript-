import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link2, Eye, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface JobUrlFetcherProps {
    onFetch: (url: string) => Promise<void>;
}

export const JobUrlFetcher: React.FC<JobUrlFetcherProps> = ({ onFetch }) => {
    const { t } = useTranslation();
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handlePreview = async () => {
        if (!url) return;
        setIsLoading(true);
        setStatus('idle');
        try {
            await onFetch(url);
            setStatus('success');
        } catch (error) {
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t("Job Post URL")}
                </label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/careers/job-id"
                            className={`w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 transition-colors dark:text-slate-200 ${status === 'error'
                                    ? 'border-red-300 focus:border-red-500 dark:border-red-700'
                                    : status === 'success'
                                        ? 'border-emerald-300 focus:border-emerald-500 dark:border-emerald-700'
                                        : 'border-slate-300 focus:border-emerald-500 dark:border-slate-600'
                                }`}
                        />
                        <Link2 className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    </div>
                    <button
                        onClick={handlePreview}
                        disabled={!url || isLoading}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>
                                <Eye size={18} />
                                {t("Preview")}
                            </>
                        )}
                    </button>
                </div>

                {status === 'success' && (
                    <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                        <CheckCircle2 size={14} />
                        {t("URL validated successfully")}
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5 animate-in fade-in">
                        <AlertCircle size={14} />
                        {t("Could not fetch job description from this URL")}
                    </div>
                )}
            </div>
        </div>
    );
};
