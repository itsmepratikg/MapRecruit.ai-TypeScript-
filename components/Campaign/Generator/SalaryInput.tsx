import React from 'react';
import { useTranslation } from 'react-i18next';

interface SalaryConfig {
    min: string;
    max: string;
    currency: string;
    period: string;
}

interface WorkingHoursConfig {
    min: string;
    max: string;
}

interface SalaryInputProps {
    salary: SalaryConfig;
    onSalaryChange: (val: SalaryConfig) => void;
    hours: WorkingHoursConfig;
    onHoursChange: (val: WorkingHoursConfig) => void;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];
const PERIODS = ['Per Hour', 'Per Day', 'Per Week', 'Per Month', 'Per Year'];

export const SalaryInput: React.FC<SalaryInputProps> = ({ salary, onSalaryChange, hours, onHoursChange }) => {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            {/* Salary */}
            <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{t("Salary Range")}</label>
                <div className="space-y-3">
                    <div className="flex gap-2 items-center">
                        <select
                            value={salary.currency}
                            onChange={e => onSalaryChange({ ...salary, currency: e.target.value })}
                            className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        >
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="flex items-center gap-2 flex-1">
                            <input
                                type="number"
                                value={salary.min}
                                onChange={e => onSalaryChange({ ...salary, min: e.target.value })}
                                placeholder="Min"
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 text-sm outline-none"
                            />
                            <span className="text-slate-400">-</span>
                            <input
                                type="number"
                                value={salary.max}
                                onChange={e => onSalaryChange({ ...salary, max: e.target.value })}
                                placeholder="Max"
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 text-sm outline-none"
                            />
                        </div>
                    </div>
                    <select
                        value={salary.period}
                        onChange={e => onSalaryChange({ ...salary, period: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    >
                        {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>

            {/* Working Hours */}
            <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{t("Working Hours")}</label>
                <div className="flex flex-col h-full pt-1">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 space-y-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Min Hours</span>
                            <input
                                type="number"
                                value={hours.min}
                                onChange={e => onHoursChange({ ...hours, min: e.target.value })}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 text-sm outline-none"
                            />
                        </div>
                        <span className="text-slate-400 mt-6">-</span>
                        <div className="flex-1 space-y-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Max Hours</span>
                            <input
                                type="number"
                                value={hours.max}
                                onChange={e => onHoursChange({ ...hours, max: e.target.value })}
                                placeholder="40"
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 text-sm outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
