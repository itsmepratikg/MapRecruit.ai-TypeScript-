import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight } from 'lucide-react';

interface GenerateJDButtonProps {
    onClick: () => void;
}

export const GenerateJDButton: React.FC<GenerateJDButtonProps> = ({ onClick }) => {
    const { t } = useTranslation();

    return (
        <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-4 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-xl border border-violet-100 dark:border-violet-800/30 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-violet-600 dark:text-violet-400">
                        <Sparkles size={20} className="fill-current" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{t("Provide basic info to generate JD")}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t("Use our advanced AI to craft the perfect job description")}</p>
                    </div>
                </div>

                <button
                    onClick={onClick}
                    className="px-4 py-2 bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 font-medium text-sm rounded-lg shadow-sm border border-violet-100 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 group-hover:translate-x-0.5"
                >
                    {t("Generate")} <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};
