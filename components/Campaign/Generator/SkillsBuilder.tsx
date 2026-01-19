import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Trash2 } from 'lucide-react';

export interface SkillGroup {
    id: string;
    skills: string[];
    logic: 'AND' | 'OR';
}

interface SkillsBuilderProps {
    title: string;
    groups: SkillGroup[];
    onChange: (groups: SkillGroup[]) => void;
}

export const SkillsBuilder: React.FC<SkillsBuilderProps> = ({ title, groups, onChange }) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('');
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
    const [orInputValue, setOrInputValue] = useState('');

    const handleAddSkill = () => {
        if (!inputValue.trim()) return;
        const newGroup: SkillGroup = {
            id: crypto.randomUUID(),
            skills: [inputValue.trim()],
            logic: 'OR'
        };
        onChange([...groups, newGroup]);
        setInputValue('');
    };

    const handleAddOrSkill = (groupId: string, skill: string) => {
        const group = groups.find(g => g.id === groupId);
        if (!group) return;

        // Validation: No duplicates in OR groups
        if (group.logic === 'OR' && group.skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
            return;
        }

        const newGroups = groups.map(g => {
            if (g.id === groupId) {
                return { ...g, skills: [...g.skills, skill] };
            }
            return g;
        });
        onChange(newGroups);
    };

    const toggleGroupLogic = (groupId: string) => {
        const newGroups = groups.map(g => {
            if (g.id === groupId) {
                return { ...g, logic: g.logic === 'OR' ? 'AND' : 'OR' };
            }
            return g;
        });
        onChange(newGroups);
    };

    const handleRemoveSkill = (groupId: string, skillIndex: number) => {
        const newGroups = groups.map(g => {
            if (g.id === groupId) {
                const newSkills = g.skills.filter((_, i) => i !== skillIndex);
                return { ...g, skills: newSkills };
            }
            return g;
        }).filter(g => g.skills.length > 0);
        onChange(newGroups);
    };

    const handleRemoveGroup = (groupId: string) => {
        onChange(groups.filter(g => g.id !== groupId));
    };

    const submitOrSkill = () => {
        if (activeGroupId && orInputValue.trim()) {
            handleAddOrSkill(activeGroupId, orInputValue.trim());
            setOrInputValue('');
            setActiveGroupId(null);
        }
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{title}</label>

            {/* Main Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder={t("Type a skill and press Enter...")}
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-slate-200"
                />
                <button
                    type="button"
                    onClick={handleAddSkill}
                    disabled={!inputValue.trim()}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium active:scale-95 transition-transform"
                >
                    {t("Add")}
                </button>
            </div>

            {/* Visual Flow Builder */}
            <div className="flex flex-wrap items-center gap-y-4 gap-x-2">
                {groups.map((group, groupIndex) => (
                    <div key={group.id} className="flex items-center gap-2">

                        {/* Remove external AND connector */}


                        {/* The Group Pill */}
                        <div className="flex items-center gap-1.5 bg-sky-500 text-white pl-3 pr-2 py-1.5 rounded-lg shadow-sm border border-sky-600 group hover:shadow-md transition-shadow relative">

                            {group.skills.map((skill, skillIndex) => (
                                <React.Fragment key={skillIndex}>
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">{skill}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(group.id, skillIndex)}
                                            className="hover:text-red-100 p-0.5 rounded-full transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    {/* OR/AND Logic Badge in between skills */}
                                    {skillIndex < group.skills.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={() => toggleGroupLogic(group.id)}
                                            className="text-[10px] font-bold bg-sky-400/30 text-white px-1.5 py-0.5 rounded uppercase hover:bg-white hover:text-sky-600 transition-all mx-0.5"
                                            title="Click to toggle logic"
                                        >
                                            {group.logic}
                                        </button>
                                    )}
                                </React.Fragment>
                            ))}

                            {/* Internal Group Adder Area */}
                            {activeGroupId === group.id ? (
                                <div className="flex items-center gap-1 animate-in zoom-in-95 duration-200">
                                    <span className="text-[10px] font-bold opacity-70 uppercase">{group.logic}</span>
                                    <input
                                        type="text"
                                        value={orInputValue}
                                        onChange={(e) => setOrInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), submitOrSkill())}
                                        autoFocus
                                        onBlur={() => {
                                            if (orInputValue.trim()) submitOrSkill();
                                            else setActiveGroupId(null);
                                        }}
                                        className="w-24 px-1.5 py-0.5 text-xs text-slate-800 rounded bg-white border-none focus:ring-1 focus:ring-white outline-none"
                                        placeholder="..."
                                    />
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setActiveGroupId(group.id)}
                                    className="ml-1 p-0.5 hover:bg-white/20 rounded transition-colors"
                                    title={group.logic === 'OR' ? t("Add Synonym") : t("Add Required Part")}
                                >
                                    <Plus size={16} />
                                </button>
                            )}

                            {/* Remove Whole Group - Hover menu style */}
                            <button
                                type="button"
                                onClick={() => handleRemoveGroup(group.id)}
                                className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 w-5 h-5 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 border border-slate-200 transition-all scale-75 group-hover:scale-100"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                ))}

                {groups.length === 0 && (
                    <div className="w-full text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 text-sm italic">
                        {t("Start by adding a skill above...")}
                    </div>
                )}
            </div>
        </div>
    );
};
