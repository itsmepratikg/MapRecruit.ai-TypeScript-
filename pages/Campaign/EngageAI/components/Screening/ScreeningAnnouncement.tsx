
import React, { useState } from 'react';
import { ScreeningRound, ReachOutSources, ReachOutChannelConfig } from '../../../../../types/Round';
import { MOCK_SENDERS, MOCK_TEMPLATES } from '../../constants';
import { Mail, MessageSquare, ChevronDown, CheckCircle } from '../../../../../components/Icons';

interface Props {
    round: ScreeningRound;
    onChange: (updates: Partial<ScreeningRound>) => void;
}

export const ScreeningAnnouncement: React.FC<Props> = ({ round, onChange }) => {
    const [activeTab, setActiveTab] = useState<keyof ReachOutSources>('email');

    const updateSource = (channel: keyof ReachOutSources, updates: Partial<ReachOutChannelConfig>) => {
        const currentSources = round.reachOutSources || {};
        const currentChannel = currentSources[channel] || { selected: false };
        onChange({
            reachOutSources: {
                ...currentSources,
                [channel]: { ...currentChannel, ...updates }
            }
        });
    };

    const currentConfig = round.reachOutSources?.[activeTab] || { selected: false };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Channel Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
                {(['email', 'SMS'] as const).map((channel) => (
                    <button
                        key={channel}
                        onClick={() => setActiveTab(channel)}
                        className={`px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === channel
                            ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        {channel === 'email' ? <Mail size={16} /> : <MessageSquare size={16} />}
                        {channel === 'email' ? 'Email' : 'SMS'}
                        {round.reachOutSources?.[channel]?.selected && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Channel Config */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        {activeTab === 'email' ? <Mail size={18} /> : <MessageSquare size={18} />}
                        {activeTab === 'email' ? 'Email Configuration' : 'SMS Configuration'}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Use {activeTab === 'email' ? 'Email' : 'SMS'}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={currentConfig.selected}
                                onChange={(e) => updateSource(activeTab, { selected: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>
                </div>

                {currentConfig.selected ? (
                    <div className="space-y-6">
                        {/* Sender Selection */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Sender Profile</label>
                            <select
                                value={currentConfig.senderID || ''}
                                onChange={(e) => updateSource(activeTab, { senderID: e.target.value })}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-slate-200"
                            >
                                <option value="">Select a Sender...</option>
                                {MOCK_SENDERS.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Template Selection */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Message Template</label>
                            <select
                                value={currentConfig.templateID || ''}
                                onChange={(e) => updateSource(activeTab, { templateID: e.target.value })}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-slate-200"
                            >
                                <option value="">Select a Template...</option>
                                {MOCK_TEMPLATES.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Toggles Row */}
                        <div className="flex gap-8 pt-4 border-t border-slate-200 dark:border-slate-700">
                            {/* Conditional Template */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={currentConfig.conditionalTemplate || false}
                                        onChange={(e) => updateSource(activeTab, { conditionalTemplate: e.target.checked })}
                                    />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Conditional Template</span>
                            </label>

                            {/* Follow Up */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={currentConfig.followUp?.selected || false}
                                        onChange={(e) => updateSource(activeTab, { followUp: { ...currentConfig.followUp, selected: e.target.checked } })}
                                    />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Auto Follow-up</span>
                            </label>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                        <p>{activeTab === 'email' ? 'Email' : 'SMS'} channel is disabled for this round.</p>
                        <p className="text-sm mt-2">Enable it using the toggle above.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
