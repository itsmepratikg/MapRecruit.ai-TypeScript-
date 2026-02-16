import React from 'react';
import { Sparkles, Brain, CheckCircle, XCircle, Clock, Zap } from '../../../components/Icons';
import { SkillMatchCategory } from '../../../utils/mongoUtils';

const SkillTag = ({ skill, category }: { skill: string, category: SkillMatchCategory }) => {
    let styles = "bg-slate-50 text-slate-700 border-slate-100";
    let Icon = CheckCircle;

    switch (category) {
        case SkillMatchCategory.EXACT_MATCH:
            styles = "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800";
            Icon = CheckCircle;
            break;
        case SkillMatchCategory.EXACT_MATCH_NOT_RECENT:
            styles = "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800";
            Icon = Clock;
            break;
        case SkillMatchCategory.SIMILAR_SKILL:
            styles = "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800";
            Icon = Zap;
            break;
        case SkillMatchCategory.NOT_MENTIONED:
            styles = "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800";
            Icon = XCircle;
            break;
    }

    return (
        <span className={`px-2.5 py-1 ${styles} border rounded-md text-xs font-medium flex items-center gap-1`}>
            <Icon size={12} /> {skill}
        </span>
    );
};

export const MatchSummary = ({ candidate }: any) => {
    const { skills } = candidate;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={100} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                <Brain size={18} className="text-indigo-600 dark:text-indigo-400" /> Match Intelligence
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                {candidate.aiSummary}
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column 1: Matched Skills */}
                <div className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                        <CheckCircle size={16} className="text-emerald-500" /> Matched Skills
                    </h4>

                    {/* Required Section */}
                    <div>
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Required Criteria</h5>
                        <div className="flex flex-wrap gap-2">
                            {skills.matched.required.length > 0 ? skills.matched.required.map((skill: any, idx: number) => (
                                <SkillTag key={`matched-req-${idx}`} skill={skill.text} category={skill.category} />
                            )) : <span className="text-xs text-slate-400 italic">No required skills matched.</span>}
                        </div>
                    </div>

                    {/* Preferred Section */}
                    <div>
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Preferred Criteria</h5>
                        <div className="flex flex-wrap gap-2">
                            {skills.matched.preferred.length > 0 ? skills.matched.preferred.map((skill: any, idx: number) => (
                                <SkillTag key={`matched-pref-${idx}`} skill={skill.text} category={skill.category} />
                            )) : <span className="text-xs text-slate-400 italic">No preferred skills matched.</span>}
                        </div>
                    </div>
                </div>

                {/* Column 2: Missing Gaps */}
                <div className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                        <XCircle size={16} className="text-red-500" /> Missing Gaps
                    </h4>

                    {/* Required Section */}
                    <div>
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Required Criteria</h5>
                        <div className="flex flex-wrap gap-2">
                            {skills.missing.required.length > 0 ? skills.missing.required.map((skill: string, idx: number) => (
                                <span key={`missing-req-${idx}`} className="px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800 rounded-md text-xs font-medium flex items-center gap-1">
                                    <XCircle size={12} /> {skill}
                                </span>
                            )) : <span className="text-xs text-slate-400 italic">No required skills missing.</span>}
                        </div>
                    </div>

                    {/* Preferred Section */}
                    <div>
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Preferred Criteria</h5>
                        <div className="flex flex-wrap gap-2">
                            {skills.missing.preferred.length > 0 ? skills.missing.preferred.map((skill: string, idx: number) => (
                                <span key={`missing-pref-${idx}`} className="px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800 rounded-md text-xs font-medium flex items-center gap-1">
                                    <XCircle size={12} /> {skill}
                                </span>
                            )) : <span className="text-xs text-slate-400 italic">No preferred skills missing.</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
