import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, CheckCircle, ArrowRight } from 'lucide-react';

interface SourceCandidatesStepProps {
    onBack: () => void;
    onContinue: () => void;
}

export const SourceCandidatesStep: React.FC<SourceCandidatesStepProps> = ({ onBack, onContinue }) => {
    const { t } = useTranslation();

    return (
        <div className="h-full flex flex-col p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto custom-scrollbar">
            <div className="max-w-3xl mx-auto w-full text-center space-y-8 py-10">
                <div className="flex flex-col items-center space-y-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 animate-bounce-subtle">
                            <Users size={48} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 rounded-full p-1 border-2 border-emerald-500 text-emerald-500">
                            <CheckCircle size={24} />
                        </div>
                    </div>

                    <div className="max-w-md">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Ready to Source!</h2>
                        <p className="text-slate-500 mt-4 text-lg">Your campaign has been successfully configured. We are ready to start finding the best candidates for your role.</p>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-lg mx-auto">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4">What happens next?</h4>
                    <ul className="text-left text-sm text-slate-600 dark:text-slate-400 space-y-3">
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">1</div>
                            <span>Our AI will analyze your JD and find matching profiles.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">2</div>
                            <span>Engage AI will start any configured screening rounds.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">3</div>
                            <span>You can track all progress in the Intelligence dashboard.</span>
                        </li>
                    </ul>
                </div>

                <div className="flex items-center justify-center gap-6 pt-10">
                    <button
                        onClick={onBack}
                        className="text-slate-500 hover:text-slate-700 font-medium"
                    >
                        {t("Back")}
                    </button>
                    <button
                        onClick={onContinue}
                        className="flex items-center gap-3 px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                        Go to Intelligence
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
