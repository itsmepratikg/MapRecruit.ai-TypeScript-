import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from '../Icons';

export const HoverMenu = ({ campaign, onAction, isOpenMobile, position = 'right' }: { campaign: any, onAction: (action: string) => void, isOpenMobile?: boolean, position?: 'left' | 'right' }) => {
    const { t } = useTranslation();
    const [activeSub, setActiveSub] = useState<string | null>(null);
    const timeoutRef = useRef<any>(null);

    const handleMouseEnter = (menu: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveSub(menu);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveSub(null);
        }, 150);
    };

    const name = campaign.schemaConfig?.mainSchema?.title || campaign.title || t('Untitled Campaign');

    const menuClasses = position === 'right'
        ? "absolute left-full top-0 ml-4 z-[100] animate-in fade-in zoom-in-95 duration-200 w-56 origin-top-left"
        : "absolute right-full top-0 mr-4 z-[100] animate-in fade-in zoom-in-95 duration-200 w-56 origin-top-right";

    const triangleClasses = position === 'right'
        ? "absolute top-3 -left-2 w-4 h-4 bg-white dark:bg-slate-800 transform rotate-45 border-l border-b border-gray-100 dark:border-slate-700 shadow-sm z-10"
        : "absolute top-3 -right-2 w-4 h-4 bg-white dark:bg-slate-800 transform rotate-45 border-r border-t border-gray-100 dark:border-slate-700 shadow-sm z-10";

    const subMenuClasses = position === 'right'
        ? "absolute left-[100%] top-0 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 ml-1 py-1 z-50 animate-in fade-in slide-in-from-left-2 duration-150"
        : "absolute right-[100%] top-0 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 mr-1 py-1 z-50 animate-in fade-in slide-in-from-right-2 duration-150";

    return (
        <div className={`${menuClasses} ${isOpenMobile ? 'block' : 'hidden group-hover/item:block'}`}>
            <div className={triangleClasses}></div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 overflow-visible relative">
                <div className="px-4 py-3 border-b border-gray-50 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
                    <h4 className="font-bold text-gray-800 dark:text-slate-100 text-sm truncate" title={name}>{name}</h4>
                </div>
                <div className="py-1 flex flex-col relative">
                    <button onClick={(e) => { e.stopPropagation(); onAction('INTELLIGENCE'); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400 transition-colors">
                        {t("Intelligence")}
                    </button>
                    <div className="relative w-full" onMouseEnter={() => handleMouseEnter('SOURCE')} onMouseLeave={handleMouseLeave}>
                        <button onClick={(e) => { e.stopPropagation(); onAction('SOURCE_AI'); }} className={`w-full text-left px-4 py-2 text-sm transition-colors flex justify-between items-center ${activeSub === 'SOURCE' ? 'bg-sky-50 dark:bg-slate-700 text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-green-600 dark:hover:text-green-400'}`}>
                            <span>{t("Source AI")}</span>
                            <ChevronRight size={14} className={activeSub === 'SOURCE' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'} />
                        </button>
                        {activeSub === 'SOURCE' && (
                            <div className={subMenuClasses}>
                                <button onClick={(e) => { e.stopPropagation(); onAction('ATTACH_PEOPLE'); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400 block">{t("Attach People")}</button>
                                <button onClick={(e) => { e.stopPropagation(); onAction('ATTACHED_PROFILES'); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400 block">{t("Attached Profiles")}</button>
                                <button onClick={(e) => { e.stopPropagation(); onAction('INTEGRATIONS'); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400 block">{t("Integrations")}</button>
                                <button onClick={(e) => { e.stopPropagation(); onAction('JOB_DESC'); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400 block">{t("Job Description")}</button>
                            </div>
                        )}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onAction('MATCH_AI'); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400 transition-colors">
                        {t("Match AI")}
                    </button>
                    <div className="relative w-full" onMouseEnter={() => handleMouseEnter('ENGAGE')} onMouseLeave={handleMouseLeave}>
                        <button onClick={(e) => { e.stopPropagation(); onAction('ENGAGE_AI'); }} className={`w-full text-left px-4 py-2 text-sm transition-colors flex justify-between items-center ${activeSub === 'ENGAGE' ? 'bg-sky-50 dark:bg-slate-700 text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-green-600 dark:hover:text-green-400'}`}>
                            <span>{t("Engage AI")}</span>
                            <ChevronRight size={14} className={activeSub === 'ENGAGE' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'} />
                        </button>
                        {activeSub === 'ENGAGE' && (
                            <div className={subMenuClasses}>
                                <button onClick={(e) => { e.stopPropagation(); onAction('ENGAGE_CANDIDATES'); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400 block">{t("Candidate List")}</button>
                                <button onClick={(e) => { e.stopPropagation(); onAction('ENGAGE_WORKFLOW'); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400 block">{t("Workflow Builder")}</button>
                                <button onClick={(e) => { e.stopPropagation(); onAction('ENGAGE_INTERVIEW'); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400 block">{t("Interview Panel")}</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
