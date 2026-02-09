
import React from 'react';
import { Loader2 } from '../Icons';

interface PagePreloaderProps {
    message?: string;
    fullScreen?: boolean;
}

export const PagePreloader: React.FC<PagePreloaderProps> = ({
    message = "Preparing Experience...",
    fullScreen = true
}) => {
    return (
        <div className={`
            ${fullScreen ? 'fixed inset-0 z-[9999]' : 'w-full h-full min-h-[400px]'}
            flex flex-col items-center justify-center p-6
            bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md
            animate-in fade-in duration-500
        `}>
            <div className="relative">
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-400/10 rounded-full blur-2xl animate-pulse scale-150"></div>

                {/* Main Spinner */}
                <div className="relative group">
                    <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>

                    {/* Inner Pulsing Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center animate-bounce">
                            <Loader2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading text with shimmer effect */}
            <div className="mt-8 space-y-2 text-center">
                <h3 className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-emerald-600 to-slate-900 dark:from-white dark:via-emerald-400 dark:to-white bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                    MapRecruit
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide uppercase flex items-center gap-2 justify-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    {message}
                </p>
            </div>

            {/* Bottom Progress Bar (Visual Only) */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-900 pointer-events-none">
                <div className="h-full bg-emerald-500 w-1/3 animate-loading-bar shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </div>

            <style>{`
                @keyframes shimmer {
                    to { background-position: 200% center; }
                }
                @keyframes loading-bar {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
                .animate-loading-bar {
                    animation: loading-bar 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
                }
                .animate-shimmer {
                    animation: shimmer 3s linear infinite;
                }
            `}</style>
        </div>
    );
};
