
import React, { useState } from 'react';
import { ScreeningRound, RoundEligibility, RoundAutomation } from '../../../../../types/Round';
import { Settings, filter, Clock, Calendar, AlertCircle, CheckCircle } from '../../../../../components/Icons';
import { TimePicker } from '../../../../../components/TimePicker';

interface Props {
    round: ScreeningRound;
    onChange: (updates: Partial<ScreeningRound>) => void;
    roundIndex: number; // To determine if it's Round 1 or later
}

export const ScreeningAutomation: React.FC<Props> = ({ round, onChange, roundIndex }) => {
    const [activeTab, setActiveTab] = useState<'eligibility' | 'schedule'>('eligibility');

    // Ensure objects exist
    const eligibility = round.roundEligibility || { eligibilityCriteria: 'All of these' } as RoundEligibility;
    const automation = round.automateDetails || { automationPreference: 'Immediate', automate: false } as RoundAutomation['automateDetails'];

    const updateEligibility = (updates: Partial<RoundEligibility>) => {
        onChange({ roundEligibility: { ...eligibility, ...updates } });
    };

    const updateAutomation = (updates: Partial<RoundAutomation['automateDetails']>) => {
        onChange({ automateDetails: { ...automation, ...updates } });
    };

    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('eligibility')}
                    className={`px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'eligibility'
                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    <filter size={16} /> Eligibility Criteria
                </button>
                <button
                    onClick={() => setActiveTab('schedule')}
                    className={`px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'schedule'
                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    <Clock size={16} /> Execution Schedule
                </button>
            </div>

            {activeTab === 'eligibility' && (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Candidate Qualification</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Define who receives this screening round.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* MRI Score */}
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">MapRecruit Index (MRI)</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={eligibility.MRI?.enable || false}
                                            onChange={(e) => updateEligibility({ MRI: { ...eligibility.MRI, enable: e.target.checked } as any })}
                                        />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                                {eligibility.MRI?.enable && (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0" max="10"
                                            value={eligibility.MRI?.minMRIScore || 0}
                                            onChange={(e) => updateEligibility({ MRI: { ...eligibility.MRI, minMRIScore: parseInt(e.target.value) } as any })}
                                            className="w-20 px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded text-sm text-center"
                                            placeholder="Min"
                                        />
                                        <span className="text-slate-400">-</span>
                                        <input
                                            type="number"
                                            min="0" max="10"
                                            value={eligibility.MRI?.maxMRIScore || 10}
                                            onChange={(e) => updateEligibility({ MRI: { ...eligibility.MRI, maxMRIScore: parseInt(e.target.value) } as any })}
                                            className="w-20 px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded text-sm text-center"
                                            placeholder="Max"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* EQ Score (Progressive) */}
                            {roundIndex > 0 && (
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Previous Round Score</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={eligibility.expectedResponseScore?.enable || false}
                                                onChange={(e) => updateEligibility({ expectedResponseScore: { ...eligibility.expectedResponseScore, enable: e.target.checked } as any })}
                                            />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </div>
                                    {eligibility.expectedResponseScore?.enable && (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="0" max="10"
                                                value={eligibility.expectedResponseScore?.minExpectedResponseScore || 0}
                                                onChange={(e) => updateEligibility({ expectedResponseScore: { ...eligibility.expectedResponseScore, minExpectedResponseScore: parseInt(e.target.value) } as any })}
                                                className="w-20 px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded text-sm text-center"
                                                placeholder="Min"
                                            />
                                            <span className="text-slate-400">-</span>
                                            <input
                                                type="number"
                                                min="0" max="10"
                                                value={eligibility.expectedResponseScore?.maxExpectedResponseScore || 10}
                                                onChange={(e) => updateEligibility({ expectedResponseScore: { ...eligibility.expectedResponseScore, maxExpectedResponseScore: parseInt(e.target.value) } as any })}
                                                className="w-20 px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded text-sm text-center"
                                                placeholder="Max"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'schedule' && (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Automation Schedule</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Control when this round is triggered.</p>

                        <div className="space-y-4">
                            {/* Preference */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Trigger Preference</label>
                                <div className="flex gap-2">
                                    {['Immediate', 'Regular Intervals', 'Specific Times'].map(pref => (
                                        <button
                                            key={pref}
                                            onClick={() => updateAutomation({ automationPreference: pref })}
                                            className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${automation.automationPreference === pref ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}`}
                                        >
                                            {pref}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Specific Times Config */}
                            {automation.automationPreference === 'Specific Times' && (
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Schedule At</label>
                                    <div className="flex items-center gap-2">
                                        <TimePicker
                                            value={automation.timings?.[0] || '09:00'}
                                            onChange={(val) => updateAutomation({ timings: [val] })}
                                            format="12h"
                                        />
                                        <span className="text-xs text-slate-400">Timezone: {automation.timeZone || 'User Local'}</span>
                                    </div>
                                </div>
                            )}

                            {/* Exclude Days */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Exclude Days</label>
                                <div className="flex flex-wrap gap-2">
                                    {DAYS.map(day => (
                                        <button
                                            key={day}
                                            onClick={() => {
                                                const current = automation.excludeDays || [];
                                                const isExcluded = current.includes(day);
                                                const newExcluded = isExcluded ? current.filter(d => d !== day) : [...current, day];
                                                updateAutomation({ excludeDays: newExcluded });
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${automation.excludeDays?.includes(day) ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600'}`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
