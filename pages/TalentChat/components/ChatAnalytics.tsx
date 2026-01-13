
import React from 'react';
import { 
  BarChart2, Clock, MessageSquare, Users, TrendingUp, CheckCircle, 
  ArrowUpRight, ArrowDownRight, Mail, Phone, Globe, Smartphone 
} from '../../../components/Icons';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend 
} from 'recharts';

// --- MOCK DATA ---

const OVERVIEW_METRICS = [
  { label: 'Total Conversations', value: '1,284', change: '+12.5%', isPositive: true, icon: MessageSquare, color: 'blue' },
  { label: 'Avg Response Time', value: '1m 42s', change: '-8.1%', isPositive: true, icon: Clock, color: 'emerald' },
  { label: 'Engagement Rate', value: '68%', change: '+4.3%', isPositive: true, icon: TrendingUp, color: 'purple' },
  { label: 'Resolution Rate', value: '92%', change: '-1.2%', isPositive: false, icon: CheckCircle, color: 'orange' },
];

const ACTIVITY_DATA = [
  { name: 'Mon', inbound: 40, outbound: 24 },
  { name: 'Tue', inbound: 30, outbound: 13 },
  { name: 'Wed', inbound: 20, outbound: 58 },
  { name: 'Thu', inbound: 27, outbound: 39 },
  { name: 'Fri', inbound: 18, outbound: 48 },
  { name: 'Sat', inbound: 23, outbound: 38 },
  { name: 'Sun', inbound: 34, outbound: 43 },
];

const CHANNEL_DATA = [
  { name: 'Email', value: 45, color: '#3b82f6', icon: Mail },
  { name: 'SMS', value: 30, color: '#10b981', icon: Smartphone },
  { name: 'WhatsApp', value: 15, color: '#8b5cf6', icon: Phone },
  { name: 'Website', value: 10, color: '#f59e0b', icon: Globe },
];

const AGENT_PERFORMANCE = [
  { id: 1, name: 'Sarah Jenkins', conversations: 145, responseTime: '45s', rating: 4.8 },
  { id: 2, name: 'Mike Ross', conversations: 98, responseTime: '2m 10s', rating: 4.5 },
  { id: 3, name: 'David Chen', conversations: 112, responseTime: '1m 05s', rating: 4.7 },
  { id: 4, name: 'Emily Clark', conversations: 65, responseTime: '3m 40s', rating: 4.2 },
];

// --- COMPONENTS ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg outline-none min-w-[150px]">
        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 pb-2 border-b border-slate-100 dark:border-slate-700">{label}</p>
        <div className="space-y-1.5 pt-1">
            {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium capitalize">{entry.name}</span>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">{entry.value}</span>
            </div>
            ))}
        </div>
      </div>
    );
  }
  return null;
};

export const ChatAnalytics = () => {
  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                    <BarChart2 size={24} className="text-emerald-500" />
                    Chat Analytics
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Performance metrics and conversation insights.</p>
            </div>
            <select className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Quarter</option>
            </select>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {OVERVIEW_METRICS.map((metric, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg bg-${metric.color}-50 dark:bg-${metric.color}-900/20 text-${metric.color}-600 dark:text-${metric.color}-400`}>
                            <metric.icon size={20} />
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${metric.isPositive ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'}`}>
                            {metric.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {metric.change}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{metric.value}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide mt-1">{metric.label}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Message Volume Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Message Volume</h3>
                    <div className="flex gap-4 text-xs">
                        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Inbound</span>
                        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Outbound</span>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ACTIVITY_DATA}>
                            <defs>
                                <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="inbound" stroke="#6366f1" fillOpacity={1} fill="url(#colorInbound)" strokeWidth={2} />
                            <Area type="monotone" dataKey="outbound" stroke="#34d399" fillOpacity={1} fill="url(#colorOutbound)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Channel Distribution */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Channel Mix</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Distribution of messages by source.</p>
                
                <div className="flex-1 min-h-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={CHANNEL_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {CHANNEL_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">1.2k</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total</span>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    {CHANNEL_DATA.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                    <item.icon size={14} className="text-slate-400" /> {item.name}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Agent Performance Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Agent Performance</h3>
                <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View All Agents</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium">
                        <tr>
                            <th className="px-6 py-3">Agent Name</th>
                            <th className="px-6 py-3 text-center">Conversations</th>
                            <th className="px-6 py-3 text-center">Avg Response Time</th>
                            <th className="px-6 py-3 text-right">CSAT Rating</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {AGENT_PERFORMANCE.map(agent => (
                            <tr key={agent.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                            {agent.name.charAt(0)}
                                        </div>
                                        {agent.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-300">{agent.conversations}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${agent.responseTime.startsWith('4') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                                        {agent.responseTime}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1 font-bold text-slate-800 dark:text-slate-200">
                                        <span className="text-amber-400">★</span> {agent.rating}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};
