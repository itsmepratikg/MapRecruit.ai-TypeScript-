
import React, { useState } from 'react';
import { ScreeningRound } from '../../../../../types/Round';
import { Users, Clock, MapPin, Video, Phone, Calendar, Bell, MessageSquare } from '../../../../../components/Icons';
import { MOCK_SENDERS } from '../../constants'; // Using senders as mock hosts

interface Props {
    round: ScreeningRound;
    onChange: (updates: Partial<ScreeningRound>) => void;
}

export const ScreeningInterview: React.FC<Props> = ({ round, onChange }) => {
    // Ensure nested objects exist
    const f2f = round.f2fSchedule || {};

    const updateF2F = (updates: any) => {
        onChange({ f2fSchedule: { ...f2f, ...updates } });
    };

    const toggleHost = (hostId: string) => {
        const currentHosts = f2f.scheduledHostID || [];
        const newHosts = currentHosts.includes(hostId)
            ? currentHosts.filter(id => id !== hostId)
            : [...currentHosts, hostId];
        updateF2F({ scheduledHostID: newHosts });
    };

    const toggleMeetType = (type: string) => {
        const currentTypes = round.availableMeetTypes || [];
        const newTypes = currentTypes.includes(type)
            ? currentTypes.filter(t => t !== type)
            : [...currentTypes, type];
        onChange({ availableMeetTypes: newTypes });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Host Selection */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
                    <Users size={18} className="text-emerald-500" /> Interview Hosts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {MOCK_SENDERS.map(host => (
                        <div
                            key={host.id}
                            onClick={() => toggleHost(host.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${f2f.scheduledHostID?.includes(host.id) ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800'}`}
                        >
                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${f2f.scheduledHostID?.includes(host.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                {f2f.scheduledHostID?.includes(host.id) && <Users size={12} fill="currentColor" />}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{host.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Interviewer</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logistics */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-6">
                    <Clock size={18} className="text-emerald-500" /> Logistics & Scheduling
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Duration - Need to add this to schema or assume it's implied/fixed? schema has scheduleBuffer but not duration? Oh, wait. CalendarSettings has slot duration. */}
                    {/* Assuming standard duration for now or using automationDetails */}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Buffer Time (Minutes)</label>
                        <select
                            value={f2f.scheduleBuffer || 15}
                            onChange={(e) => updateF2F({ scheduleBuffer: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-slate-200"
                        >
                            <option value="0">No Buffer</option>
                            <option value="5">5 Minutes</option>
                            <option value="10">10 Minutes</option>
                            <option value="15">15 Minutes</option>
                            <option value="30">30 Minutes</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Meeting Type</label>
                        <div className="flex gap-2">
                            {['Live Video', 'In-Person', 'Phone'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => toggleMeetType(type)}
                                    className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${round.availableMeetTypes?.includes(type) ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Location (only if In-Person) */}
                {round.availableMeetTypes?.includes('In-Person') && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Physical Location</label>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                            <MapPin size={16} className="text-slate-400" />
                            <input
                                type="text"
                                value={f2f.location?.address || ''}
                                onChange={(e) => updateF2F({ location: { ...f2f.location, address: e.target.value } })}
                                className="w-full bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200"
                                placeholder="e.g. 123 Main St, Conference Room A"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Reminders */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-6">
                    <Bell size={18} className="text-emerald-500" /> Automated Reminders
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                <MessageSquare size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Email Reminder</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Send reminder before interview</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {f2f.reminderEmail?.selected && (
                                <select
                                    value={f2f.reminderEmail.reminderTime}
                                    onChange={(e) => updateF2F({ reminderEmail: { ...f2f.reminderEmail, reminderTime: parseInt(e.target.value) } })}
                                    className="text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent dark:text-slate-300"
                                >
                                    <option value={15}>15 mins before</option>
                                    <option value={30}>30 mins before</option>
                                    <option value={60}>1 hour before</option>
                                    <option value={1440}>1 day before</option>
                                </select>
                            )}
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={f2f.reminderEmail?.selected || false}
                                    onChange={(e) => updateF2F({ reminderEmail: { selected: e.target.checked, reminderTime: f2f.reminderEmail?.reminderTime || 60 } })}
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500">
                                <MessageSquare size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">SMS Reminder</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Send text message reminder</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {f2f.reminderSMS?.selected && (
                                <select
                                    value={f2f.reminderSMS.reminderTime}
                                    onChange={(e) => updateF2F({ reminderSMS: { ...f2f.reminderSMS, reminderTime: parseInt(e.target.value) } })}
                                    className="text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent dark:text-slate-300"
                                >
                                    <option value={15}>15 mins before</option>
                                    <option value={30}>30 mins before</option>
                                    <option value={60}>1 hour before</option>
                                </select>
                            )}
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={f2f.reminderSMS?.selected || false}
                                    onChange={(e) => updateF2F({ reminderSMS: { selected: e.target.checked, reminderTime: f2f.reminderSMS?.reminderTime || 30 } })}
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
