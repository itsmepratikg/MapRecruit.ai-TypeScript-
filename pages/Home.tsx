
import React from 'react';
import { 
  WelcomeHeader, MetricCard, AlertsWidget, TrendGraph, 
  SourceDistributionChart, EmailDeliveryReport, PreScreeningProgress, EmptyWidget 
} from '../components/DashboardWidgets';
import { Briefcase, Users, UserCheck, UserX, ChevronDown } from 'lucide-react';

export const Home = () => {
  return (
    <div className="p-4 lg:p-6 bg-slate-50/50 dark:bg-slate-900 min-h-full overflow-y-auto transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Row 1: Welcome & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           <div className="lg:col-span-4 flex flex-col">
              <WelcomeHeader />
           </div>
           <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 <MetricCard 
                    title="Active Campaigns" 
                    value="4" 
                    icon={Briefcase} 
                    colorClass="text-green-600" 
                    iconBg="bg-green-50" 
                 />
                 <MetricCard 
                    title="Closed Campaigns" 
                    value="71" 
                    icon={Briefcase} 
                    colorClass="text-red-500" 
                    iconBg="bg-red-50" 
                 />
                 <MetricCard 
                    title="Active Profiles" 
                    value="11k" 
                    icon={Users} 
                    colorClass="text-blue-600" 
                    iconBg="bg-blue-50" 
                 />
                 <MetricCard 
                    title="Shortlisted" 
                    value="9" 
                    icon={UserCheck} 
                    colorClass="text-emerald-600" 
                    iconBg="bg-emerald-50" 
                 />
              </div>
              {/* Alerts Row */}
              <div className="flex-1">
                 <AlertsWidget />
              </div>
           </div>
        </div>

        {/* Row 2: Trends & Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="min-h-[350px]">
             <TrendGraph />
           </div>
           <div className="min-h-[350px]">
             <SourceDistributionChart />
           </div>
        </div>

        {/* Row 3: Upcoming, Email, Portal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="min-h-[300px]">
             <EmptyWidget 
                title="Upcoming Interviews" 
                sub={
                   <div className="flex gap-2">
                      <select className="text-[10px] border rounded px-1 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"><option>Interviews</option></select>
                      <div className="flex bg-gray-100 dark:bg-slate-700 rounded"><button className="px-2 text-[10px] dark:text-slate-300">Previous</button><button className="px-2 text-[10px] bg-white dark:bg-slate-600 shadow-sm dark:text-white">Upcoming</button></div>
                   </div>
                } 
             />
           </div>
           <div className="min-h-[300px]">
             <EmailDeliveryReport />
           </div>
           <div className="min-h-[300px]">
             <EmptyWidget 
                title="Portal Sourcing Reports" 
                sub={<select className="text-[10px] border rounded px-1 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"><option>Last 7 days</option></select>} 
             />
           </div>
        </div>

        {/* Row 4: Pre-Screening Flow */}
        <div className="min-h-[300px]">
           <PreScreeningProgress />
        </div>

      </div>
    </div>
  );
};
