import React from 'react';
import { useTranslation } from 'react-i18next';
import { Type } from 'lucide-react';

interface CampaignTitleProps {
    value: string;
    onChange: (value: string) => void;
}

export const CampaignTitle: React.FC<CampaignTitleProps> = ({ value, onChange }) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("Campaign Title")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={t("Enter campaign title...")}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors dark:text-slate-200"
                    autoFocus
                />
                <Type className="absolute left-3 top-2.5 text-slate-400" size={18} />
            </div>
        </div>
    );
};
