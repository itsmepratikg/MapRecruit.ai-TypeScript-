
import React from 'react';
import { ScreeningRound } from '../../../../../types/Round';
import { RichTextEditor } from '../../../../../components/RichTextEditor';
import { MessageSquare, ArrowRight, ArrowLeft } from '../../../../../components/Icons';

interface Props {
    round: ScreeningRound;
    onChange: (updates: Partial<ScreeningRound>) => void;
}

export const ScreeningGeneral: React.FC<Props> = ({ round, onChange }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Round Name */}
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Round Name <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    value={round.roundName}
                    onChange={(e) => onChange({ roundName: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-slate-200"
                    placeholder="e.g. Initial Screening"
                />
            </div>

            {/* Communication Method */}
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Communication Method</label>
                <div className="flex gap-4">
                    {/* Inbound */}
                    <div
                        onClick={() => onChange({ communicationMethod: 'Inbound' })}
                        className={`flex flex-1 items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${round.communicationMethod === 'Inbound' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${round.communicationMethod === 'Inbound' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            <ArrowLeft size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">Inbound</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Candidate contacts you
                            </p>
                        </div>
                    </div>

                    {/* Outbound */}
                    <div
                        onClick={() => onChange({ communicationMethod: 'Outbound' })}
                        className={`flex flex-1 items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${round.communicationMethod === 'Outbound' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${round.communicationMethod === 'Outbound' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            <ArrowRight size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">Outbound</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                System contacts candidate
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description/Instructions */}
            <div>
                <RichTextEditor
                    label={round.roundType === 'Announcement' ? "Announcement Content" : "Instructions / Description"}
                    value={round.description?.text || ''}
                    onChange={(val) => onChange({ description: { ...round.description, text: val } })}
                    placeholder="Enter details..."
                />
            </div>
        </div>
    );
};
