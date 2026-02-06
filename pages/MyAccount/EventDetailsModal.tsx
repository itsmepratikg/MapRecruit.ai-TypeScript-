import React from 'react';
import { X, Clock, MapPin, ExternalLink, Calendar as CalendarIcon, Edit2, Trash2, Globe, Users, AlignLeft, Paperclip } from '../../components/Icons';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onUpdate?: (event: any) => void;
  onDelete?: (eventId: string) => void;
}

export const EventDetailsModal = ({ isOpen, onClose, event, onUpdate, onDelete }: EventDetailsModalProps) => {
  if (!isOpen || !event) return null;

  const { title, start, end, extendedProps } = event;
  const description = extendedProps?.description;
  const location = extendedProps?.location;
  const eventLink = extendedProps?.link || extendedProps?.data?.link;

  // Robust Meeting Link Detection
  const getMeetLink = () => {
    // 1. Direct hangoutLink from Google
    if (extendedProps?.hangoutLink) return extendedProps.hangoutLink;
    if (extendedProps?.data?.hangoutLink) return extendedProps.data.hangoutLink;

    // 2. Check conferenceData entry points
    const confData = extendedProps?.conferenceData || extendedProps?.data?.conferenceData;
    if (confData?.entryPoints) {
      const videoEntry = confData.entryPoints.find((ep: any) => ep.entryPointType === 'video');
      if (videoEntry?.uri) return videoEntry.uri;
    }

    // 3. Fallback to location if it looks like a URL
    if (location && (
      location.startsWith('http') ||
      location.includes('zoom.us') ||
      location.includes('teams.microsoft') ||
      location.includes('meet.google.com')
    )) {
      return location;
    }

    return null;
  };

  const meetLink = getMeetLink();
  const attendees = extendedProps?.attendees || extendedProps?.data?.attendees || [];
  const attachments = extendedProps?.attachments || [];
  const timeZoneName = extendedProps?.timeZoneFullName || 'America/New_York';

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">

        {/* Header Section */}
        <div className="relative h-24 bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute -bottom-6 left-8 h-12 w-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center text-emerald-600 border border-slate-100 dark:border-slate-700">
            <CalendarIcon size={24} />
          </div>
        </div>

        <div className="pt-10 pb-8 px-8 space-y-6">
          {/* Title Area */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white leading-tight truncate">
                  {title}
                </h3>
                {eventLink && (
                  <a href={eventLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-500 transition-colors" title="Open in Google Calendar">
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <span className="bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/30 capitalize">
                  {event.extendedProps?.provider || 'Event'}
                </span>
              </div>
            </div>
          </div>

          {/* Time & Date */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400">
              <Clock size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">{formatDate(start)}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {formatTime(start)} – {formatTime(end)}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                <Globe size={12} /> {timeZoneName}
              </div>
            </div>
          </div>

          {/* Guests / Attendees */}
          {attendees.length > 0 && (
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400">
                <Users size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Members</p>
                <div className="space-y-2">
                  {attendees.map((a: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-slate-50 dark:border-slate-800 last:border-0">
                      <span className="text-slate-700 dark:text-slate-300 truncate mr-2" title={a.email}>
                        {a.displayName || a.email?.split('@')[0] || 'Unknown'}
                      </span>
                      <span className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-full ${a.responseStatus === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                        a.responseStatus === 'declined' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                        {a.responseStatus?.replace(/([a-z])([A-Z])/g, '$1 $2') || 'invited'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Location */}
          {location && (
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Location</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{location}</p>
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400">
                <AlignLeft size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Description</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{description}</p>
              </div>
            </div>
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400">
                <Paperclip size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Attachments</p>
                <div className="space-y-2">
                  {attachments.map((file: any, i: number) => (
                    <a
                      key={i}
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-all group"
                    >
                      <div className="p-1.5 bg-white dark:bg-slate-700 rounded shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors">
                        <Paperclip size={14} />
                      </div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                        {file.title || 'Attached File'}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex gap-2">
              <button
                onClick={() => onUpdate && onUpdate(event)}
                className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
                title="Edit Event"
              >
                <Edit2 size={20} />
              </button>
            </div>

            {meetLink && (
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-200 dark:shadow-none transition-all hover:-translate-y-0.5"
              >
                Join Meeting
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
