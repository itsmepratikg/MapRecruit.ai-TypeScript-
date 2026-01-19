
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import {
    Monitor, Moon, Sun, Smartphone, Tablet, Layout, Save, RotateCcw,
    CheckCircle, Plus, X, GripHorizontal, Trash2, Palette, Edit2, Lock, Globe
} from '../../components/Icons';
import { GridStack } from 'gridstack';
import { WIDGET_DEFINITIONS } from '../../components/DashboardWidgets'; // Import Definitions
import { useToast } from '../../components/Toast';

import { useTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES } from '../../src/i18n';

// ... (Imports remain, remove LANGUAGES text array)

// --- Components ---

const ThemePreviewCard = ({ mode, label, active, onClick, disabled }: any) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${active ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <div className={`w-full aspect-video rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative ${mode === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                {/* Mock UI */}
                <div className="absolute top-0 left-0 right-0 h-3 bg-slate-200 dark:bg-slate-800 flex items-center px-1 gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                </div>
                <div className="flex h-full pt-3">
                    <div className="w-1/4 bg-slate-50 dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700"></div>
                    <div className="flex-1 p-2">
                        <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-700 rounded mb-1"></div>
                        <div className="h-2 w-1/2 bg-slate-100 dark:bg-slate-700 rounded"></div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {active && <CheckCircle size={16} className="text-emerald-500" />}
                <span className={`text-sm font-bold ${active ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>{label}</span>
            </div>
        </button>
    );
};

const WidgetPlaceholder = ({ id, onRemove, readOnly }: any) => {
    const def = WIDGET_DEFINITIONS.find(d => d.id === id);
    return (
        <div className="h-full w-full bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden relative group">
            <div className="h-6 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between px-2 cursor-move handle">
                <div className="flex items-center gap-1 text-slate-400">
                    <GripHorizontal size={12} />
                    <span className="text-[10px] font-bold uppercase truncate max-w-[100px]">{def?.title}</span>
                </div>
                {!readOnly && (
                    <button onClick={onRemove} className="text-slate-400 hover:text-red-500 transition-colors">
                        <X size={12} />
                    </button>
                )}
            </div>
            <div className="flex-1 flex items-center justify-center p-2">
                <div className="text-center opacity-40">
                    <Layout size={20} className="mx-auto mb-1" />
                    <p className="text-[9px]">{def?.title}</p>
                </div>
            </div>
        </div>
    );
};
// --- Main Component ---

export const Appearance = () => {
    const {
        theme, updateTheme,
        languageCode, updateLanguage,
        dateFormat,
        dashboardLayouts, updateDashboardLayout, resetDashboard, saveSettings
    } = useUserPreferences();

    const { addToast } = useToast();
    const { t } = useTranslation();

    // --- STATE ---
    const [activeSection, setActiveSection] = useState<'THEME' | 'LAYOUT'>('THEME');
    const [isEditing, setIsEditing] = useState(false);

    // Layout Editor State
    const [activeViewMode, setActiveViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [layoutState, setLayoutState] = useState<any[]>([]);
    const [availableWidgets, setAvailableWidgets] = useState<string[]>([]);

    const gridRef = useRef<GridStack | null>(null);

    // --- EFFECTS ---

    // 1. Initialize Layout State from Preferences
    useEffect(() => {
        if (dashboardLayouts && dashboardLayouts[activeViewMode]) {
            setLayoutState(JSON.parse(JSON.stringify(dashboardLayouts[activeViewMode])));
        }
    }, [dashboardLayouts, activeViewMode, activeSection]);

    // 2. Calculate Available Widgets
    useEffect(() => {
        if (!layoutState) return;
        const usedIds = layoutState.map(w => w.id);
        const allIds = WIDGET_DEFINITIONS.map(w => w.id);
        setAvailableWidgets(allIds.filter(id => !usedIds.includes(id)));
    }, [layoutState]);

    // 3. Initialize GridStack
    useEffect(() => {
        if (activeSection === 'LAYOUT') {
            const timer = setTimeout(() => {
                // Check if grid is already initialized on this element
                if (gridRef.current) return;

                const el = document.getElementById('grid-stack-editor');
                if (!el) return;

                const grid = GridStack.init({
                    float: true,
                    cellHeight: 100,
                    minRow: 1,
                    disableResize: !isEditing,
                    disableDrag: !isEditing,
                    column: 12,
                    margin: 4,
                    animate: true,
                }, el);

                gridRef.current = grid;

                grid.on('change', (event: Event, items: any[]) => {
                    setLayoutState(prev => {
                        if (!items) return prev;
                        const next = [...prev];
                        items.forEach((item) => {
                            const idx = next.findIndex(w => w.id === item.id);
                            if (idx !== -1) {
                                next[idx] = {
                                    ...next[idx],
                                    x: item.x,
                                    y: item.y,
                                    w: item.w,
                                    h: item.h
                                };
                            }
                        });
                        return next;
                    });
                });
            }, 100);

            return () => {
                clearTimeout(timer);
                if (gridRef.current) {
                    gridRef.current.destroy(false); // don't remove DOM nodes
                    gridRef.current = null;
                }
            };
        }
    }, [activeSection]);

    // 4. Toggle Edit Mode
    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.enableMove(isEditing);
            gridRef.current.enableResize(isEditing);
        }
    }, [isEditing]);

    // --- HANDLERS ---

    const addWidgetToGrid = (id: string) => {
        const def = WIDGET_DEFINITIONS.find(d => d.id === id);
        if (!def) return;

        const newWidget = {
            id: def.id,
            x: 0,
            y: 0, // Auto-place
            w: def.defaultW,
            h: def.defaultH
        };

        setLayoutState(prev => [...prev, newWidget]);

        // GridStack will pick up new DOM element after render, 
        // but we might need to tell it to makeWidget if it doesn't auto-detect immediately
        setTimeout(() => {
            if (gridRef.current) {
                const el = document.querySelector(`.grid-stack-item[gs-id="${id}"]`);
                if (el) gridRef.current.makeWidget(el);
            }
        }, 50);
    };

    const removeWidget = (id: string) => {
        const el = document.querySelector(`.grid-stack-item[gs-id="${id}"]`);
        if (gridRef.current && el) {
            gridRef.current.removeWidget(el as HTMLElement, false);
        }
        setLayoutState(prev => prev.filter(w => w.id !== id));
    };

    const handleSaveLayout = () => {
        updateDashboardLayout(layoutState, activeViewMode);
        setIsEditing(false);
        addToast('Layout saved successfully', 'success');
    };

    const handleReset = () => {
        resetDashboard();
        addToast('Layout reset to default', 'info');
    };

    return (
        <div className="p-8 lg:p-12">
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 dark:border-slate-700 pb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            {activeSection === 'THEME' ? <Palette size={24} className="text-emerald-500" /> : <Layout size={24} className="text-emerald-500" />}
                            {t('Appearance')}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('Customize the look and feel of your workspace.')}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <button
                            onClick={() => {
                                if (isEditing) {
                                    if (activeSection === 'LAYOUT') {
                                        handleSaveLayout();
                                    } else {
                                        // Save Theme/Language
                                        saveSettings();
                                        setIsEditing(false);
                                    }
                                } else {
                                    setIsEditing(true);
                                }
                            }}
                            className={`px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                        >
                            {isEditing ? <><Save size={16} /> {t('Save Changes')}</> : <><Edit2 size={16} /> {t('Edit Settings')}</>}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setActiveSection('THEME')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeSection === 'THEME' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        {t('Interface Theme')}
                    </button>
                    <button
                        onClick={() => setActiveSection('LAYOUT')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeSection === 'LAYOUT' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        {t('Dashboard Layout')}
                    </button>
                </div>

                {/* 1. Appearance / Theme */}
                {activeSection === 'THEME' && (
                    <section className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
                        {/* Language Settings */}
                        <div>
                            <div className="mb-4 flex justify-between items-end">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"><Globe size={18} className="text-slate-400" /> {t('Regional Settings')}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('Set your preferred display language.')}</p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 max-w-md">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{t('System Language')}</label>
                                <select
                                    className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                                    value={languageCode}
                                    onChange={(e) => updateLanguage(e.target.value)} // Sends Code (en-US)
                                    disabled={!isEditing}
                                >
                                    {SUPPORTED_LOCALES.map(loc => (
                                        <option key={loc.code} value={loc.code}>
                                            {loc.label}
                                        </option>
                                    ))}
                                </select>

                                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 dark:text-slate-400">Date Format:</span>
                                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{dateFormat}</span>
                                    </div>
                                </div>

                                {!isEditing && <p className="text-xs text-slate-400 mt-2 italic flex items-center gap-1"><Lock size={10} /> {t('Edit to change language')}</p>}
                            </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700"></div>

                        {/* Theme Settings */}
                        <div>
                            <div className="mb-6 flex justify-between items-end">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('Theme Selection')}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('Select a color scheme that suits your preference.')}</p>
                                </div>
                                {!isEditing && <div className="text-xs text-slate-400 italic flex items-center gap-1"><Lock size={12} /> {t('Edit to change theme')}</div>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <ThemePreviewCard
                                    mode="light"
                                    label={t("Light Mode")}
                                    active={theme === 'light'}
                                    onClick={() => updateTheme('light')}
                                    disabled={!isEditing}
                                />
                                <ThemePreviewCard
                                    mode="dark"
                                    label={t("Dark Mode")}
                                    active={theme === 'dark'}
                                    onClick={() => updateTheme('dark')}
                                    disabled={!isEditing}
                                />
                                <ThemePreviewCard
                                    mode="system"
                                    label={t("System Default")}
                                    active={theme === 'system'}
                                    onClick={() => updateTheme('system')}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* 2. Dashboard Layout Editor */}
                {/* ... (Layout section remains mostly unchanged except for translation if needed, but keeping simple for now) */}
                {activeSection === 'LAYOUT' && (
                    <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* ... Layout header ... */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('Dashboard Layout')}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{t('Rearrange or resize widgets for your dashboard.')}</p>
                            </div>
                            {/* ... View Mode Buttons ... */}
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start md:self-auto">
                                <button
                                    onClick={() => setActiveViewMode('desktop')}
                                    className={`p-2 rounded-md transition-all ${activeViewMode === 'desktop' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                    title="Desktop Layout"
                                >
                                    <Monitor size={18} />
                                </button>
                                <button
                                    onClick={() => setActiveViewMode('tablet')}
                                    className={`p-2 rounded-md transition-all ${activeViewMode === 'tablet' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                    title="Tablet Layout"
                                >
                                    <Tablet size={18} />
                                </button>
                                <button
                                    onClick={() => setActiveViewMode('mobile')}
                                    className={`p-2 rounded-md transition-all ${activeViewMode === 'mobile' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                    title="Mobile Layout"
                                >
                                    <Smartphone size={18} />
                                </button>
                            </div>
                        </div>

                        {/* ... Editor ... */}
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            {/* ... Sidebar ... */}
                            <div className={`w-full lg:w-64 shrink-0 space-y-4 transition-opacity ${!isEditing ? 'opacity-60 pointer-events-none' : ''}`}>
                                {/* ... Available Widgets ... */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                                    {/* ... */}
                                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 flex items-center justify-between">
                                        Available Widgets
                                        <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full">{availableWidgets.length}</span>
                                    </h4>
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                                        {availableWidgets.map(id => {
                                            const def = WIDGET_DEFINITIONS.find(d => d.id === id);
                                            return (
                                                <div key={id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm">
                                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{def?.title}</span>
                                                    <button
                                                        onClick={() => addWidgetToGrid(id)}
                                                        className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-1 rounded transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        {availableWidgets.length === 0 && (
                                            <p className="text-xs text-slate-400 italic text-center py-4">All widgets added.</p>
                                        )}
                                    </div>
                                </div>

                                {/* ... Actions ... */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Actions</h4>
                                    <div className="space-y-2">
                                        <button
                                            onClick={handleSaveLayout}
                                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Save size={16} /> {t('Save Layout')}
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            className="w-full py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <RotateCcw size={16} /> {t('Reset to Default')}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ... Canvas ... */}
                            <div className={`flex-1 w-full bg-slate-100 dark:bg-slate-900/50 rounded-xl border-2 border-slate-300 dark:border-slate-700 min-h-[500px] p-4 relative ${isEditing ? 'border-dashed' : ''}`}>
                                <div id="grid-stack-editor" className="grid-stack">
                                    {layoutState.map(w => (
                                        <div
                                            key={w.id}
                                            className="grid-stack-item"
                                            gs-id={w.id}
                                            gs-x={w.x}
                                            gs-y={w.y}
                                            gs-w={w.w}
                                            gs-h={w.h}
                                        >
                                            <div className="grid-stack-item-content">
                                                <WidgetPlaceholder id={w.id} onRemove={() => removeWidget(w.id)} readOnly={!isEditing} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Empty State */}
                                {layoutState.length === 0 && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none">
                                        <Layout size={48} className="mb-2 opacity-50" />
                                        <p className="text-sm">Canvas is empty</p>
                                        <p className="text-xs">Add widgets from the sidebar</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};
