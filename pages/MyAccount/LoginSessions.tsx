import React from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { Clock, Monitor, MapPin, Shield } from '../../components/Icons';

export const LoginSessions = () => {
    const { userProfile } = useUserProfile();

    // Helper to format date with user's specific timezone
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: userProfile.timeZone || 'UTC'
            }) + (userProfile.timeZone ? ` (${userProfile.timeZone})` : ' (UTC)');
        } catch (error) {
            return 'Invalid Date';
        }
    };

    return (
        <div className="p-8 lg:p-12 mb-20 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Login History</h1>
                <p className="text-slate-500 dark:text-slate-400">View your active sessions and login activity.</p>
            </div>

            <div className="grid gap-6">
                {/* Active Session Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-emerald-100 dark:border-emerald-900 shadow-sm p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Active Now
                        </span>
                    </div>

                    <div className="flex items-start gap-5">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <Monitor size={24} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Current Session</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                You are currently logged in on this device.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <MapPin size={14} className="text-slate-400" />
                                    <span>{userProfile.location || 'Unknown Location'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <Shield size={14} className="text-slate-400" />
                                    <span>IP Address: 192.168.1.1 (Current)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Login Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Sessions */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center text-center">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 mb-4">
                            <Clock size={32} />
                        </div>
                        <span className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                            {userProfile.loginCount || 0}
                        </span>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            Total User Sessions
                        </span>
                    </div>

                    {/* Last Login Detail */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-center">
                        <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Clock size={14} /> Previous Login Details
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Last Logged In At</span>
                                <span className="text-lg font-semibold text-slate-800 dark:text-slate-100 block">
                                    {formatDate(userProfile.lastLoginAt)}
                                </span>
                            </div>

                            {userProfile.timeZone && (
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                                    <span className="text-xs text-slate-400">Displaying time in <strong>{userProfile.timeZone}</strong> (User Preference)</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
