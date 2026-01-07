
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { 
  Monitor, Moon, Sun, Smartphone, Tablet, Layout, Save, RotateCcw, 
  CheckCircle, Plus, X, GripHorizontal, Trash2
} from '../../components/Icons';
import { GridStack } from 'gridstack';
import { WIDGET_DEFINITIONS } from '../../components/DashboardWidgets'; // Import Definitions
import { useToast } from '../../components/Toast';

// --- Components ---

const ThemePreviewCard = ({ 
    mode, 
    active, 
    onClick, 
    label 
}: { 
    mode: 'light' | 'dark' | 'system', 
    active: boolean, 
    onClick: () => void, 
    label: string 
}) => {
    return (
        <button 
            onClick={onClick}
            className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all w-full text-left group ${active ? 'border-emerald-500 bg-emerald-50/10 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'}`}
        >
            {active && <div className="absolute top-3 right-3 text-emerald-500"><CheckCircle size={20} /></div>}
            
            {/* Visual Representation */}
            <div className={`w-full aspect-video rounded-lg shadow-sm overflow-hidden border ${mode === 'dark' ? 'bg-slate-900 border-slate-700' : (mode === 'system' ? 'bg-gradient-to-br from-white to-slate-900 border-slate-300' : 'bg-white border-slate-200')}`}>
                <div className="h-full w-full p-3 flex gap-2">
                    {/* Sidebar Mock */}
                    <div className={`w-1/4 h-full rounded-md opacity-50 ${mode === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                    <div className="flex-1 flex flex-col gap-2">
                        {/* Header Mock */}
                        <div className={`w-full h-4 rounded-md opacity-50 ${mode === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                        {/* Content Mock */}
                        <div className="flex-1 flex gap-2">
                            <div className={`flex-1 h-full rounded-md opacity-40 ${mode === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}></div>
                            <div className={`flex-1 h-full rounded-md opacity-40 ${mode === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <span className={`font-bold text-sm ${active ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{label}</span>
            </div>
        </button>
    );
};

const WidgetPlaceholder = ({ id, onRemove }: { id: string, onRemove?: () => void }) => {
    const def = WIDGET_DEFINITIONS.find(w => w.id === id);
    const title = def ? def.title : id.replace(/_/g, ' ');

    return (
        <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm relative group overflow-hidden">
            {/* Header / Drag Handle */}
            <div className="h-8 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between px-2 cursor-move grid-stack-item-content-drag-handle">
                <GripHorizontal size={14} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate ml-2 flex-1">{title}</span>
                {onRemove && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Remove Widget"
                    >
                        <Trash2 size={12} />
                    </button>
                )}
            </div>
            
            {/* Body Placeholder */}
            <div className="flex-1 flex items-center justify-center bg-slate-50/30 dark:bg-slate-900/30">
                <div className="w-8 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            </div>
        </div>
    );
};

// --- Main Component ---

export const Appearance = () => {
  const { theme, updateTheme, dashboardLayouts, updateDashboardLayout, resetDashboard } = useUserPreferences();
  const { addToast } = useToast();
  const gridRef = useRef<GridStack | null>(null);
  
  const [activeTab, setActiveTab] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [availableWidgets, setAvailableWidgets] = useState<string[]>([]);
  const [layoutState, setLayoutState] = useState<any[]>([]);

  // Initialize Available Widgets (those not in current layout)
  useEffect(() => {
      const currentLayout = dashboardLayouts[activeTab] || [];
      const currentIds = currentLayout.map((w: any) => w.id);
      const available = WIDGET_DEFINITIONS.filter(def => !currentIds.includes(def.id)).map(d => d.id);
      setAvailableWidgets(available);
      setLayoutState(currentLayout);
  }, [activeTab, dashboardLayouts]);

  // Init GridStack
  useEffect(() => {
      if (gridRef.current) {
          gridRef.current.destroy(false);
      }

      const options = {
          column: activeTab === 'mobile' ? 1 : (activeTab === 'tablet' ? 6 : 12),
          cellHeight: 60,
          margin: 10,
          animate: true,
          float: true,
          disableResize: activeTab === 'mobile',
          acceptWidgets: true,
          removable: '.trash-zone',
      };

      setTimeout(() => {
        const gridEl = document.getElementById('grid-stack-editor');
        if (gridEl) {
            gridRef.current = GridStack.init(options, gridEl);
            
            // Sync changes
            gridRef.current.on('change', (event: Event, items: any) => {
                // Update local state is tricky with gridstack, best to read on save
            });
        }
      }, 100);

      return () => {
          if (gridRef.current) {
              gridRef.current.destroy(false);
          }
      };
  }, [activeTab]);

  const handleSaveLayout = () => {
      if (!gridRef.current) return;
      const layout = gridRef.current.save(false) as any[]; // false = content not saved
      // Map back to our structure (id, x, y, w, h)
      const cleanLayout = layout.map(item => ({
          id: item.id,
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          visible: true
      }));
      
      updateDashboardLayout(cleanLayout, activeTab);
      addToast(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} layout saved successfully`, "success");
  };

  const handleReset = () => {
      resetDashboard();
      addToast("Dashboard layouts reset to default", "info");
  };

  const addWidgetToGrid = (widgetId: string) => {
      if (!gridRef.current) return;
      const def = WIDGET_DEFINITIONS.find(w => w.id === widgetId);
      if (!def) return;

      gridRef.current.addWidget({
          id: widgetId,
          w: def.defaultW,
          h: def.defaultH,
          minW: def.minW,
          minH: def.minH,
          content: `<div class="grid-stack-item-content-placeholder">${def.title}</div>` // Placeholder content, React renders over it via Portal ideally, but for editor simpler is fine
      });
      
      // Update local available list
      setAvailableWidgets(prev => prev.filter(id => id !== widgetId));
  };

  const removeWidget = (widgetId: string) => {
      if (!gridRef.current) return;
      const el = document.querySelector(`.grid-stack-item[gs-id="${widgetId}"]`);
      if (el) {
          gridRef.current.removeWidget(el as HTMLElement);
          setAvailableWidgets(prev => [...prev, widgetId]);
      }
  };

  return (
    <div className="p-8 lg:p-12">
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-300 pb-12">
      
      {/* 1. Appearance / Theme */}
      <section>
          <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Monitor size={20} className="text-emerald-500" /> Interface Theme
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose how MapRecruit looks to you.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ThemePreviewCard 
                  mode="light" 
                  label="Light Mode" 
                  active={theme === 'light'} 
                  onClick={() => updateTheme('light')} 
              />
              <ThemePreviewCard 
                  mode="dark" 
                  label="Dark Mode" 
                  active={theme === 'dark'} 
                  onClick={() => updateTheme('dark')} 
              />
              <ThemePreviewCard 
                  mode="system" 
                  label="System Default" 
                  active={theme === 'system'} 
                  onClick={() => updateTheme('system')} 
              />
          </div>
      </section>

      <hr className="border-slate-200 dark:border-slate-700" />

      {/* 2. Dashboard Layout Editor */}
      <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
              <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Layout size={20} className="text-blue-500" /> Dashboard Layout
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Customize your home dashboard widgets.</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start md:self-auto">
                  <button 
                    onClick={() => setActiveTab('desktop')}
                    className={`p-2 rounded-md transition-all ${activeTab === 'desktop' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    title="Desktop Layout"
                  >
                      <Monitor size={18} />
                  </button>
                  <button 
                    onClick={() => setActiveTab('tablet')}
                    className={`p-2 rounded-md transition-all ${activeTab === 'tablet' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    title="Tablet Layout"
                  >
                      <Tablet size={18} />
                  </button>
                  <button 
                    onClick={() => setActiveTab('mobile')}
                    className={`p-2 rounded-md transition-all ${activeTab === 'mobile' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    title="Mobile Layout"
                  >
                      <Smartphone size={18} />
                  </button>
              </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Sidebar: Available Widgets */}
              <div className="w-full lg:w-64 shrink-0 space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
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

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Actions</h4>
                      <div className="space-y-2">
                          <button 
                            onClick={handleSaveLayout}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                          >
                              <Save size={16} /> Save Layout
                          </button>
                          <button 
                            onClick={handleReset}
                            className="w-full py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center justify-center gap-2 transition-colors"
                          >
                              <RotateCcw size={16} /> Reset to Default
                          </button>
                      </div>
                  </div>
              </div>

              {/* Editor Canvas */}
              <div className="flex-1 w-full bg-slate-100 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 min-h-[500px] p-4 relative">
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
                                  <WidgetPlaceholder id={w.id} onRemove={() => removeWidget(w.id)} />
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

    </div>
    </div>
  );
};
