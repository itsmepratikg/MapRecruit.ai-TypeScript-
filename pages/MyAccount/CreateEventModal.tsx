import React, { useState } from 'react';
import { X, Clock, Users, MapPin, AlignLeft, Video, CheckCircle, Loader2 } from '../../components/Icons';
import { integrationService } from '../../services/integrationService';
import { useToast } from '../../components/Toast';

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    timeZone: string;
    event?: any; // Add this for edit mode
}

export const CreateEventModal = ({ isOpen, onClose, onSuccess, timeZone, event }: CreateEventModalProps) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        summary: '',
        description: '',
        location: '',
        start: '',
        end: '',
        attendees: '',
        createMeeting: true
    });

    React.useEffect(() => {
        if (event) {
            const start = new Date(event.start);
            const end = new Date(event.end);

            // Adjust to local datetime-local format: YYYY-MM-DDTHH:MM
            const formatDateForInput = (date: Date) => {
                const pad = (n: number) => n.toString().padStart(2, '0');
                const y = date.getFullYear();
                const m = pad(date.getMonth() + 1);
                const d = pad(date.getDate());
                const h = pad(date.getHours());
                const mm = pad(date.getMinutes());
                return `${y}-${m}-${d}T${h}:${mm}`;
            };

            setFormData({
                summary: event.title || '',
                description: event.extendedProps?.description || '',
                location: event.extendedProps?.location || '',
                start: formatDateForInput(start),
                end: formatDateForInput(end),
                attendees: event.extendedProps?.attendees?.map((a: any) => a.email).join(', ') || '',
                createMeeting: !!event.extendedProps?.data?.hangoutLink || false
            });
        } else {
            setFormData({
                summary: '',
                description: '',
                location: '',
                start: '',
                end: '',
                attendees: '',
                createMeeting: true
            });
        }
    }, [event, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.summary || !formData.start || !formData.end) {
            addToast("Please fill in required fields", "error");
            return;
        }

        setLoading(true);
        try {
            const attendeeList = formData.attendees.split(',').map(email => email.trim()).filter(email => !!email);

            const eventPayload = {
                summary: formData.summary,
                description: formData.description,
                location: formData.location,
                start: { dateTime: new Date(formData.start).toISOString(), timeZone },
                end: { dateTime: new Date(formData.end).toISOString(), timeZone },
                attendees: attendeeList, // Pass flat list
                createMeeting: formData.createMeeting
            };

            let res;
            if (event && event.id) {
                res = await integrationService.updateCalendarEvent(event.id, eventPayload);
            } else {
                res = await integrationService.createCalendarEvent(eventPayload);
            }

            if (res.success) {
                addToast(`Event ${event ? 'updated' : 'created'} successfully`, "success");
                onSuccess();
                onClose();
            } else {
                addToast(`Failed to ${event ? 'update' : 'create'} event`, "error");
            }
        } catch (error) {
            console.error("Calendar save error:", error);
            addToast(`Error saving event`, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{event ? 'Edit Event' : 'Create New Event'}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Event Title *</label>
                        <input
                            required
                            type="text"
                            placeholder="Add Title"
                            className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-200 dark:border-slate-800 focus:border-emerald-500 outline-none pb-2 transition-colors dark:text-white"
                            value={formData.summary}
                            onChange={e => setFormData({ ...formData, summary: e.target.value })}
                        />
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Clock size={14} /> Start Time
                            </label>
                            <input
                                required
                                type="datetime-local"
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                value={formData.start}
                                onChange={e => setFormData({ ...formData, start: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Clock size={14} /> End Time
                            </label>
                            <input
                                required
                                type="datetime-local"
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                value={formData.end}
                                onChange={e => setFormData({ ...formData, end: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Attendees */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Users size={14} /> Add Guests (Comma separated)
                        </label>
                        <input
                            type="text"
                            placeholder="email@example.com, another@example.com"
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                            value={formData.attendees}
                            onChange={e => setFormData({ ...formData, attendees: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <AlignLeft size={14} /> Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Add description"
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white resize-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Meeting Link Toggle */}
                    <label className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl cursor-pointer group transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                                <Video size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Add Video Conferencing</p>
                                <p className="text-[11px] text-emerald-500 dark:text-emerald-500/70">Create Google Meet or Teams link</p>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-emerald-600 rounded"
                            checked={formData.createMeeting}
                            onChange={e => setFormData({ ...formData, createMeeting: e.target.checked })}
                        />
                    </label>

                    {/* Footer Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 dark:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                            Save Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
