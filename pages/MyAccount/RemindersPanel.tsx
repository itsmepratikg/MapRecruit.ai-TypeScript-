import React, { useEffect, useState } from 'react';
import { integrationService } from '../../services/integrationService';
import { Calendar, RefreshCw, Clock, ExternalLink, Plus } from '../../components/Icons';
import { useToast } from '../../components/Toast';

interface CalendarEvent {
    _id: string;
    userId: string;
    provider: 'google' | 'microsoft';
    externalId: string;
    data: {
        summary: string;
        description?: string;
        start: { dateTime: string; timeZone?: string };
        end: { dateTime: string; timeZone?: string };
        link?: string;
        location?: string;
        status?: string;
    };
    lastSynced: string;
}

interface RemindersPanelProps {
    refreshTrigger?: number;
    compact?: boolean;
    onEventClick?: (event: any) => void;
    filterQuery?: string; // Add this
}

export const RemindersPanel = ({ refreshTrigger, compact = false, onEventClick, filterQuery = '' }: RemindersPanelProps) => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();

    // Utility to parse date properly
    const getSafeDate = (dateStr: string | undefined) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? null : d;
    };

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const res = await integrationService.getCalendarEvents();
            if (res.success) {
                const validEvents = (res.events || []).filter((e: any) => {
                    return getSafeDate(e.data?.start?.dateTime || e.data?.start?.date) && getSafeDate(e.data?.end?.dateTime || e.data?.end?.date);
                });
                validEvents.sort((a: any, b: any) => {
                    const dateA = new Date(a.data.start.dateTime || a.data.start.date).getTime();
                    const dateB = new Date(b.data.start.dateTime || b.data.start.date).getTime();
                    return dateA - dateB;
                });
                const filtered = validEvents.filter((e: any) =>
                    e.data?.summary?.toLowerCase().includes(filterQuery.toLowerCase()) ||
                    e.data?.description?.toLowerCase().includes(filterQuery.toLowerCase())
                );
                setEvents(filtered.slice(0, compact ? 10 : 30)); // Adjusted slice
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [refreshTrigger, filterQuery]);

    if (compact) {
        return (
            <div className="space-y-3">
                {isLoading ? (
                    <div className="flex justify-center py-4"><RefreshCw className="animate-spin text-emerald-500" size={16} /></div>
                ) : events.length === 0 ? (
                    <div className="text-center py-4 text-slate-400 text-xs">No upcoming events</div>
                ) : (
                    events.map(event => {
                        const start = getSafeDate(event.data.start.dateTime || event.data.start.date)!;
                        return (
                            <div
                                key={event._id}
                                className="flex gap-3 group cursor-pointer"
                                onClick={() => onEventClick && onEventClick({
                                    id: event._id,
                                    title: event.data.summary,
                                    start: new Date(event.data.start.dateTime || event.data.start.date),
                                    end: new Date(event.data.end.dateTime || event.data.end.date),
                                    extendedProps: { ...event.data, id: event._id, provider: event.provider }
                                })}
                            >
                                <div className="text-xs font-bold text-slate-400 w-10 text-right py-0.5 uppercase tracking-tighter">
                                    {start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).replace(' ', '')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[13px] font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-emerald-600 transition-colors">
                                        {event.data.summary}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium">
                                        {start.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 w-full lg:w-96 flex-shrink-0">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Calendar size={18} className="text-emerald-500" /> Upcoming Reminders
                </h3>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                {isLoading && (
                    <div className="flex justify-center py-8"><RefreshCw className="animate-spin text-emerald-500" /></div>
                )}

                {!isLoading && events.length === 0 && (
                    <div className="text-center py-12 text-slate-500 text-sm">No Upcoming Reminders</div>
                )}

                {events.map((event) => {
                    const startRaw = event.data?.start?.dateTime || event.data?.start?.date;
                    const endRaw = event.data?.end?.dateTime || event.data?.end?.date;
                    const startDate = getSafeDate(startRaw);
                    const endDate = getSafeDate(endRaw);
                    if (!startDate) return null;

                    const month = startDate.toLocaleString('default', { month: 'short' });
                    const day = startDate.getDate();
                    const dayName = startDate.toLocaleString('default', { weekday: 'short' });
                    const timeRange = startDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

                    return (
                        <div
                            key={event._id}
                            className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 transition-all hover:shadow-md group cursor-pointer"
                            onClick={() => onEventClick && onEventClick({
                                id: event._id,
                                title: event.data.summary,
                                start: new Date(event.data.start.dateTime || event.data.start.date),
                                end: new Date(event.data.end.dateTime || event.data.end.date),
                                extendedProps: { ...event.data, id: event._id, provider: event.provider }
                            })}
                        >
                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex flex-col items-center justify-center border border-slate-100 dark:border-slate-600">
                                    <div className="text-[10px] font-bold text-emerald-600 uppercase leading-none">{month}</div>
                                    <div className="text-lg font-bold text-slate-800 dark:text-white leading-none">{day}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{dayName} • {timeRange}</div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                        {event.data.summary || 'No Title'}
                                    </h4>
                                    {event.data.location && (
                                        <div className="text-xs text-slate-500 mt-1 truncate">{event.data.location}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
