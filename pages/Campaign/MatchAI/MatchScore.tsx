
import React from 'react';
import { ExternalLink, ThumbsUp, MessageSquare, ThumbsDown } from '../../../components/Icons';

import { HeroWidgets } from '../../../components/HeroWidgets';

export const MatchScore = ({ candidate, widgets, metaData, permissions, onAction, shortlistStatus }: any) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex gap-5">
                <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500 dark:text-slate-300 shadow-inner shrink-0 cursor-pointer" onClick={() => onAction('view_profile')}>
                    {candidate.avatar}
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 flex-wrap">
                        <span onClick={() => onAction('view_profile')} className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            {candidate.name}
                        </span>
                        <a
                            href={`${window.location.origin}/profile/${candidate.resumeID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                            <ExternalLink size={18} />
                        </a>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium mb-2">{candidate.role} <span className="text-slate-300 dark:text-slate-600 mx-2">|</span> {candidate.location}</p>

                    {/* Hero Widgets Replacement */}
                    <div className="mt-2">
                        <HeroWidgets
                            widgets={widgets}
                            metaData={metaData}
                            permissions={permissions}
                            onAction={onAction}
                            shortlistStatus={shortlistStatus}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-900/50 px-6 py-4 rounded-xl border border-slate-100 dark:border-slate-700 w-full md:w-auto justify-center md:justify-start">
                <div className="text-center">
                    <span className="block text-3xl font-bold text-emerald-600 dark:text-emerald-400">{candidate.score}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Match Score</span>
                </div>
                <div className="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Skills: {candidate.breakdown.skills}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Exp: {candidate.breakdown.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Edu: {candidate.breakdown.education}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
