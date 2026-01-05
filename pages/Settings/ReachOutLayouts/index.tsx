
import React, { useState } from 'react';
import { Monitor, Sidebar, CheckCircle } from '../../../components/Icons';

export const ReachOutLayouts = () => {
  const [selectedLayout, setSelectedLayout] = useState('standard');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">ReachOut Layouts</h3>
          <p className="text-slate-500 dark:text-slate-400">Customize how your workspace looks and behaves.</p>
       </div>
       
       {/* Dashboard Layouts Section */}
       <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
             <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Monitor size={18} className="text-emerald-600 dark:text-emerald-400" /> 
                Dashboard Layouts
             </h4>
          </div>
          
          <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Standard Layout */}
                 <div 
                    onClick={() => setSelectedLayout('standard')}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${selectedLayout === 'standard' ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/10 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'}`}
                 >
                    <div className="flex justify-between items-center mb-4">
                       <span className={`text-sm font-bold ${selectedLayout === 'standard' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>Standard</span>
                       {selectedLayout === 'standard' && <CheckCircle size={18} className="text-emerald-500" />}
                    </div>
                    {/* Visual Preview */}
                    <div className="space-y-2 opacity-60">
                       <div className="h-16 bg-slate-200 dark:bg-slate-600 rounded-md w-full"></div>
                       <div className="flex gap-2">
                          <div className="h-24 w-1/2 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                          <div className="h-24 w-1/2 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                       </div>
                       <div className="h-12 bg-slate-200 dark:bg-slate-600 rounded-md w-full"></div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">Balanced view with metrics and charts.</p>
                 </div>

                 {/* Analytics Layout */}
                 <div 
                    onClick={() => setSelectedLayout('analytics')}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${selectedLayout === 'analytics' ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/10 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'}`}
                 >
                    <div className="flex justify-between items-center mb-4">
                       <span className={`text-sm font-bold ${selectedLayout === 'analytics' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>Data Focused</span>
                       {selectedLayout === 'analytics' && <CheckCircle size={18} className="text-emerald-500" />}
                    </div>
                    {/* Visual Preview */}
                    <div className="space-y-2 opacity-60">
                       <div className="grid grid-cols-4 gap-1">
                          <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                          <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                          <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                          <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                       </div>
                       <div className="h-32 bg-slate-200 dark:bg-slate-600 rounded-md w-full"></div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">Heavy emphasis on graphs and data tables.</p>
                 </div>

                 {/* Compact Layout */}
                 <div 
                    onClick={() => setSelectedLayout('compact')}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${selectedLayout === 'compact' ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/10 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'}`}
                 >
                    <div className="flex justify-between items-center mb-4">
                       <span className={`text-sm font-bold ${selectedLayout === 'compact' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>Compact</span>
                       {selectedLayout === 'compact' && <CheckCircle size={18} className="text-emerald-500" />}
                    </div>
                    {/* Visual Preview */}
                    <div className="space-y-1 opacity-60">
                       <div className="h-12 bg-slate-200 dark:bg-slate-600 rounded-md w-full"></div>
                       <div className="h-12 bg-slate-200 dark:bg-slate-600 rounded-md w-full"></div>
                       <div className="h-12 bg-slate-200 dark:bg-slate-600 rounded-md w-full"></div>
                       <div className="h-12 bg-slate-200 dark:bg-slate-600 rounded-md w-full"></div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">Maximized density for lists and tasks.</p>
                 </div>
              </div>
          </div>
       </div>

       {/* Interface Density */}
       <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
             <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sidebar size={18} className="text-indigo-500" /> 
                Interface Density
             </h4>
          </div>
          <div className="p-6">
             <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 dark:bg-slate-600 p-2 rounded text-slate-500 dark:text-slate-300"><Monitor size={20} /></div>
                        <div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Comfortable</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Standard spacing for better readability</p>
                        </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                    </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 dark:bg-slate-600 p-2 rounded text-slate-500 dark:text-slate-300"><Monitor size={20} /></div>
                        <div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Compact</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Reduced padding to fit more data</p>
                        </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
