import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Sparkles, MapPin, Plus } from 'lucide-react';
import { SkillsBuilder, SkillGroup } from './SkillsBuilder';
import { EducationBuilder, EducationEntry } from './EducationBuilder';
import { SalaryInput } from './SalaryInput';

interface GenerateJDFormProps {
    onBack: () => void;
    onSubmit: (html: string, formData: GenerateJDFormState) => void;
}

export interface GenerateJDFormState {
    jobTitle: string;
    expMin: number | string;
    expMax: number | string;
    locations: { id: string; value: string }[];
    jobType: string;
    reqSkills: SkillGroup[];
    prefSkills: SkillGroup[];
    education: EducationEntry[];
    salary: { min: string; max: string; currency: string; period: string };
    hours: { min: string; max: string };
}

export const GenerateJDForm: React.FC<GenerateJDFormProps> = ({ onBack, onSubmit }) => {
    const { t } = useTranslation();
    const [generating, setGenerating] = useState(false);

    // Form State
    const [jobTitle, setJobTitle] = useState('');
    const [expMin, setExpMin] = useState<number | string>(0);
    const [expMax, setExpMax] = useState<number | string>(50);
    const [locations, setLocations] = useState<{ id: string; value: string }[]>([{ id: '1', value: '' }]);
    const [jobType, setJobType] = useState('Direct Hire');
    const [reqSkills, setReqSkills] = useState<SkillGroup[]>([]);
    const [prefSkills, setPrefSkills] = useState<SkillGroup[]>([]);
    const [education, setEducation] = useState<EducationEntry[]>([]);
    const [salary, setSalary] = useState({ min: '', max: '', currency: 'USD', period: 'Per Year' });
    const [hours, setHours] = useState({ min: '', max: '' });

    const handleLocationChange = (id: string, val: string) => {
        setLocations(locations.map(loc => loc.id === id ? { ...loc, value: val } : loc));
    };

    const addLocation = () => setLocations([...locations, { id: Date.now().toString(), value: '' }]);
    const removeLocation = (id: string) => setLocations(locations.filter(loc => loc.id !== id));

    const handleGenerate = () => {
        setGenerating(true);

        const formData: GenerateJDFormState = {
            jobTitle, expMin, expMax, locations, jobType, reqSkills, prefSkills, education, salary, hours
        };

        // Mock API Generation
        setTimeout(() => {
            const html = `
                <h2>Job Title: ${jobTitle}</h2>
                <p>We are seeking a dedicated <b>${jobTitle}</b> to join our team in <b>${locations[0]?.value || 'our office'}</b>.</p>
                <br/>
                <h3>Roles and Responsibilities</h3>
                <ul>
                    <li>Operate effectively within the ${jobType} role.</li>
                    <li>Utilize skills like ${reqSkills.map(g => g.skills[0]?.name).join(', ')}.</li>
                </ul>
                <br/>
                <h3>Required Skills</h3>
                <ul>
                    ${reqSkills.map(g => `<li>${g.skills.map(s => s.name).join(' OR ')}</li>`).join('')}
                </ul>
                <br/>
                 <h3>Preferred Skills</h3>
                <ul>
                    ${prefSkills.map(g => `<li>${g.skills.map(s => s.name).join(' OR ')}</li>`).join('')}
                </ul>
                <br/>
                <p><b>Experience Level:</b> ${expMin} - ${expMax} years.</p>
                <p><b>Employment Type:</b> ${jobType}</p>
            `;
            setGenerating(false);
            onSubmit(html, formData);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 animate-in slide-in-from-right-4 duration-300">
            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
                <div className="max-w-4xl mx-auto space-y-8 pb-10">

                    {/* Job Summary */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b border-slate-100 dark:border-slate-800 pb-2">Job Summary</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("Candidate Job Title")} <span className="text-red-500">*</span></label>
                                <input
                                    value={jobTitle}
                                    onChange={e => setJobTitle(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="e.g. Senior Product Designer"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("Job Type")}</label>
                                <select
                                    value={jobType}
                                    onChange={e => setJobType(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                                >
                                    {['Direct Hire', 'Temp to Hire', 'Temporary', 'Contract'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("Years of Experience")} <span className="text-red-500">*</span></label>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <span className="text-xs text-slate-500 mb-1 block">Min</span>
                                    <input
                                        type="number"
                                        min="0" max="50"
                                        value={expMin}
                                        onChange={e => {
                                            const val = e.target.value === '' ? '' : parseInt(e.target.value);
                                            setExpMin(val);
                                        }}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                                    />
                                </div>
                                <span className="text-slate-400 mt-5">-</span>
                                <div className="flex-1">
                                    <span className="text-xs text-slate-500 mb-1 block">Max</span>
                                    <input
                                        type="number"
                                        min="0" max="50"
                                        value={expMax}
                                        onChange={e => {
                                            const val = e.target.value === '' ? '' : parseInt(e.target.value);
                                            setExpMax(val);
                                        }}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("Location")}</label>
                            {locations.map((loc, i) => (
                                <div key={loc.id} className="flex gap-2">
                                    <div className="relative flex-1">
                                        <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                                        <input
                                            value={loc.value}
                                            onChange={e => handleLocationChange(loc.id, e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                                            placeholder="City, State"
                                        />
                                    </div>
                                    {locations.length > 1 && (
                                        <button type="button" onClick={() => removeLocation(loc.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addLocation} className="text-sm text-indigo-600 font-medium flex items-center gap-1"><Plus size={16} /> {t("Add More Locations")}</button>
                        </div>
                    </section>

                    {/* Skills */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b border-slate-100 dark:border-slate-800 pb-2">Skills & Qualifications</h3>
                        <SkillsBuilder title="Required Skills" groups={reqSkills} onChange={setReqSkills} />
                        <div className="border-t border-slate-100 dark:border-slate-800" />
                        <SkillsBuilder title="Preferred Skills" groups={prefSkills} onChange={setPrefSkills} />
                    </section>

                    {/* Education */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <EducationBuilder entries={education} onChange={setEducation} />
                    </section>

                    {/* Other Details */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b border-slate-100 dark:border-slate-800 pb-2">Experience & Compensation</h3>
                        <SalaryInput
                            salary={salary} onSalaryChange={setSalary}
                            hours={hours} onHoursChange={setHours}
                        />
                    </section>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900 flex justify-end gap-3 z-10">
                <button
                    onClick={onBack}
                    className="px-6 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    {t("Cancel")}
                </button>
                <button
                    onClick={handleGenerate}
                    disabled={generating || !jobTitle}
                    className="px-8 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {generating ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating...
                        </div>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            {t("Generate JD")}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
