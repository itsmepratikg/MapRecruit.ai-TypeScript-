
import React, { useState } from 'react';
import { ScreeningRound } from '../../../../../types/Round';
import { Trash2 } from '../../../../../components/Icons';
import { ScreeningGeneral } from './ScreeningGeneral';
import { ScreeningQuestions } from './ScreeningQuestions';
import { ScreeningInterview } from './ScreeningInterview';
import { ScreeningAnnouncement } from './ScreeningAnnouncement';
import { ScreeningAutomation } from './ScreeningAutomation';

interface Props {
    round: ScreeningRound;
    roundIndex: number;
    onChange: (updates: Partial<ScreeningRound>) => void;
    onDelete: () => void;
}

export const ScreeningRoundConfig: React.FC<Props> = ({ round, roundIndex, onChange, onDelete }) => {

    // Determine which specific config component to render based on round type
    const renderSpecificConfig = () => {
        switch (round.roundType) {
            case 'Assessment':
            case 'Survey':
                return <ScreeningQuestions round={round} onChange={onChange} />;
            case 'Interview':
                return <ScreeningInterview round={round} onChange={onChange} />;
            case 'Announcement':
                return <ScreeningAnnouncement round={round} onChange={onChange} />;
            default:
                return (
                    <div className="p-8 text-center text-slate-500 italic border border-dashed border-slate-300 rounded-xl">
                        Select a round type to configure specific settings.
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky top-0 z-10">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        Configure Round {roundIndex + 1}: {round.roundName || 'Untitled Round'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Type: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{round.roundType}</span>
                    </p>
                </div>
                <button
                    onClick={onDelete}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete Round"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">

                {/* 1. General Settings (Common) */}
                <section>
                    <ScreeningGeneral round={round} onChange={onChange} />
                </section>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* 2. Type-Specific Settings */}
                <section>
                    <div className="mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">
                            {round.roundType === 'Interview' ? 'Interview Configuration' :
                                round.roundType === 'Announcement' ? 'Reach-Out Configuration' :
                                    'Questions & Responses'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure specific details for this {(round.roundType || 'Round').toLowerCase()}.
                        </p>
                    </div>
                    {renderSpecificConfig()}
                </section>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* 3. Automation & Eligibility (Common) */}
                <section>
                    <div className="mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">Automation & Logic</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Set eligibility rules and triggering conditions.
                        </p>
                    </div>
                    <ScreeningAutomation round={round} onChange={onChange} roundIndex={roundIndex} />
                </section>

            </div>
        </div>
    );
};
