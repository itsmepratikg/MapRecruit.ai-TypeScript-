
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
   FolderOpen, FolderPlus, Users,
   TrendingUp, MoreHorizontal, Search, BarChart2
} from '../../../components/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FOLDERS_LIST } from '../../../data'; // Moved mock data to centralized data file or keep here
import { FolderDetailView } from './FolderDetailView';
import { CreateFolderModal } from './CreateFolderModal';

// MOCK DATA (Ideally moved to data.ts, but keeping consistent with original logic)
const FOLDER_STATS = [
   { name: 'Pending Applicant', value: 450, color: '#eab308' },
   { name: 'Applicant', value: 320, color: '#3b82f6' },
   { name: 'Contractor', value: 85, color: '#8b5cf6' },
   { name: 'Direct Hire', value: 45, color: '#10b981' }
];

const TREND_DATA = [
   { name: 'Jan', added: 40, active: 24 },
   { name: 'Feb', added: 30, active: 13 },
   { name: 'Mar', added: 20, active: 58 },
   { name: 'Apr', added: 27, active: 39 },
   { name: 'May', added: 18, active: 48 },
   { name: 'Jun', added: 23, active: 38 },
];

export const FolderMetricsView = () => {
   const { t } = useTranslation();
   const [selectedFolder, setSelectedFolder] = useState<any | null>(null);
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

   // Drill-down View
   if (selectedFolder) {
      return <FolderDetailView folder={selectedFolder} onBack={() => setSelectedFolder(null)} />;
   }

   // Main Dashboard View
   return (
      <div className="h-full flex flex-col overflow-y-auto p-6 lg:p-8 bg-white dark:bg-slate-900 transition-colors custom-scrollbar">

         <CreateFolderModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
               <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                  <FolderOpen size={24} className="text-emerald-600 dark:text-emerald-400" />
                  {t("Folder Metrics")}
               </h2>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t("Analyze candidate distribution and activity across your talent pools.")}</p>
            </div>
            <button
               onClick={() => setIsCreateModalOpen(true)}
               className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition-colors text-sm"
            >
               <FolderPlus size={16} /> {t("Create Folder")}
            </button>
         </div>

         {/* Metrics Row */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* Total Stats Card */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Profiles</p>
                     <h3 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">900</h3>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                     <Users size={24} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
               </div>

               <div className="mt-6 space-y-3">
                  {FOLDER_STATS.map((stat) => (
                     <div key={stat.name} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                           <span className="text-slate-600 dark:text-slate-300 font-medium">{stat.name}</span>
                           <span className="text-slate-500 dark:text-slate-400 font-mono">{stat.value}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                           <div className="h-full rounded-full" style={{ width: `${(stat.value / 900) * 100}%`, backgroundColor: stat.color }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Trends Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                     <TrendingUp size={16} className="text-blue-500" /> {t("Profile Trends (All Folders)")}
                  </h3>
                  <select className="text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-2 py-1 text-slate-600 dark:text-slate-300 outline-none">
                     <option>{t("Last 6 Months")}</option>
                  </select>
               </div>
               <div className="flex-1 min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={TREND_DATA} barGap={0} barSize={20}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <Tooltip
                           cursor={{ fill: 'transparent' }}
                           contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="added" name={t("Profiles Added")} fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="active" name={t("Active Engagement")} fill="#6366f1" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         {/* Data Table */}
         <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
               <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{t("Folder Details")}</h3>
               <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                     type="text"
                     placeholder={t("Search folders...")}
                     className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-200 w-64"
                  />
               </div>
            </div>

            <div className="overflow-x-auto flex-1 custom-scrollbar">
               <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                     <tr>
                        <th className="px-6 py-3 min-w-[200px]">{t("Folder Name")}</th>
                        <th className="px-6 py-3">{t("Created Date")}</th>
                        <th className="px-6 py-3 text-center">{t("Total Profiles")}</th>
                        <th className="px-6 py-3 text-center bg-emerald-50/50 dark:bg-emerald-900/10">{t("Added (30d)")}</th>
                        <th className="px-6 py-3 text-center text-red-500">{t("No Activity (30d)")}</th>
                        <th className="px-6 py-3 text-center border-l border-slate-100 dark:border-slate-700 bg-yellow-50/30 dark:bg-yellow-900/10">{t("Pending")}</th>
                        <th className="px-6 py-3 text-center bg-blue-50/30 dark:bg-blue-900/10">{t("Applicants")}</th>
                        <th className="px-6 py-3 text-center border-l border-slate-100 dark:border-slate-700">{t("Employees")}</th>
                        <th className="px-6 py-3 text-center text-slate-400 font-normal">{t("On Assignment")}</th>
                        <th className="px-6 py-3 text-center text-slate-400 font-normal">{t("Not Assigned")}</th>
                        <th className="px-6 py-3"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                     {FOLDERS_LIST.map((folder) => (
                        <tr key={folder.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                           <td className="px-6 py-3">
                              <button
                                 onClick={() => setSelectedFolder(folder)}
                                 className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-2"
                              >
                                 <FolderOpen size={16} /> {folder.name}
                              </button>
                           </td>
                           <td className="px-6 py-3 text-slate-500 dark:text-slate-400">{folder.createdDate}</td>
                           <td className="px-6 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{folder.totalProfiles}</td>
                           <td className="px-6 py-3 text-center font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/10">+{folder.addedLast30}</td>
                           <td className="px-6 py-3 text-center font-mono text-red-500">{folder.noActivity30 > 0 ? folder.noActivity30 : '-'}</td>
                           <td className="px-6 py-3 text-center font-mono text-slate-600 dark:text-slate-300 border-l border-slate-100 dark:border-slate-700 bg-yellow-50/20 dark:bg-yellow-900/5">{folder.pending}</td>
                           <td className="px-6 py-3 text-center font-mono text-slate-600 dark:text-slate-300 bg-blue-50/20 dark:bg-blue-900/5">{folder.applicants}</td>
                           <td className="px-6 py-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200 border-l border-slate-100 dark:border-slate-700">{folder.employees}</td>
                           <td className="px-6 py-3 text-center font-mono text-slate-500 dark:text-slate-400">{folder.onAssignment}</td>
                           <td className="px-6 py-3 text-center font-mono text-slate-400 dark:text-slate-500">{folder.notOnAssignment}</td>
                           <td className="px-6 py-3 text-right">
                              <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                 <MoreHorizontal size={16} />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};
