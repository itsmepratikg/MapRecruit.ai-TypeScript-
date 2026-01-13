
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { 
  MoreHorizontal, CheckCircle, 
  Clock, Phone, Video, Search, ChevronLeft, UserPlus, Tag, Trash2, Edit2,
  X, User, Mail, MessageSquare, ChevronDown, AlertTriangle, AlertCircle, ChevronUp, Check, Layers,
  ChevronRight, File, ImageIcon, Download, Shield, EyeOff, Edit3
} from '../../../components/Icons';
import { Conversation, Message, ChannelType, Attachment } from '../types';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useToast } from '../../../components/Toast';
import { MOCK_USERS_LIST } from '../../../data';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { ComposeModal } from '../../../components/Common/Compose/ComposeModal';

interface ChatAreaProps {
  conversation: Conversation;
  onSendMessage: (text: string, isPrivate: boolean, channel: ChannelType, subject?: string) => void;
  onBack?: () => void;
  onToggleDetails: () => void;
  onAssign: (assigneeId: string | undefined, name: string | undefined) => void;
  onUpdateLabels: (labels: string[]) => void;
}

const AVAILABLE_LABELS = ['Priority', 'Negotiation', 'Technical', 'Culture Fit', 'Offer Sent'];

type AttachmentActionType = 'CREATE_PROFILE' | 'MARK_SENSITIVE' | 'DOWNLOAD';

// Reusable Attachment Card Component
const AttachmentItem: React.FC<{ 
    attachment: Attachment, 
    onAction: (action: AttachmentActionType, att: Attachment) => void,
    onDelete: () => void 
}> = ({ attachment, onAction, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isSensitive = attachment.isSensitive;

    return (
        <div className="group relative flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-500 transition-colors min-w-[180px] max-w-[220px]">
            {/* Preview/Icon */}
            <div className={`w-10 h-10 shrink-0 rounded bg-white dark:bg-slate-700 overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-600 relative ${isSensitive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>
                {isSensitive ? (
                    <div className="flex items-center justify-center w-full h-full text-slate-400" title="Sensitive Content">
                        <EyeOff size={16} />
                    </div>
                ) : (
                    attachment.type === 'image' && attachment.url ? (
                        <img src={attachment.url} alt={attachment.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-slate-400">
                            {attachment.type === 'image' ? <ImageIcon size={20} /> : <File size={20} />}
                        </div>
                    )
                )}
            </div>
            
            {/* Info */}
            <div className="min-w-0 flex-1">
                <p className={`text-xs font-medium truncate ${isSensitive ? 'text-slate-400 italic' : 'text-slate-700 dark:text-slate-200'}`} title={attachment.name}>
                    {isSensitive ? 'Hidden Content' : attachment.name}
                </p>
                <p className="text-[10px] text-slate-400">{attachment.size}</p>
            </div>

            {/* Action Menu Trigger */}
            <div className="relative" ref={menuRef}>
                <button 
                    onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                    <MoreHorizontal size={14} />
                </button>

                {showMenu && (
                    <div className="absolute right-0 top-6 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                        {!isSensitive && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); onAction('CREATE_PROFILE', attachment); setShowMenu(false); }}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                            >
                                <UserPlus size={12} className="text-blue-500" /> Create Profile
                            </button>
                        )}
                        
                        {!isSensitive && (
                             <button 
                                onClick={(e) => { e.stopPropagation(); onAction('DOWNLOAD', attachment); setShowMenu(false); }}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                            >
                                <Download size={12} className="text-green-500" /> Download
                            </button>
                        )}

                        <button 
                            onClick={(e) => { e.stopPropagation(); onAction('MARK_SENSITIVE', attachment); setShowMenu(false); }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                        >
                            <Shield size={12} className={isSensitive ? "text-slate-400" : "text-amber-500"} /> 
                            {isSensitive ? 'Unmark Sensitive' : 'Mark as Sensitive'}
                        </button>

                        <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                        
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(); setShowMenu(false); }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600 dark:text-red-400"
                        >
                            <Trash2 size={12} /> Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- EMAIL THREAD MODAL COMPONENT ---
const EmailThreadModal = ({ 
    message, 
    onClose, 
    onDeleteAttachment 
}: { 
    message: Message, 
    onClose: () => void, 
    onDeleteAttachment: (msgId: string, attId: string) => void 
}) => {
    // Generate Mock History for demonstration
    const threadMessages = useMemo(() => {
        const count = message.threadCount || 1;
        const history: Message[] = [];
        
        // Generate previous messages
        for (let i = 0; i < count - 1; i++) {
            history.push({
                ...message,
                id: `${message.id}_hist_${i}`,
                subject: i === 0 ? message.subject?.replace('Re: ', '') : message.subject, 
                content: `<p>This is a previous message in the thread sequence (${i + 1}). It contains context relevant to the conversation.</p><p>Best,<br/>Sender ${i+1}</p>`,
                timestamp: new Date(new Date(message.timestamp).getTime() - (count - i) * 86400000).toISOString(),
                attachments: i === 0 ? [{ id: `att_h_${i}`, name: 'Original_Req.pdf', size: '2.1 MB', type: 'file' }] : [],
                senderName: i % 2 === 0 ? message.senderName : 'Reply Person',
            });
        }
        // Add current (most recent) message
        history.push(message);
        return history;
    }, [message]);

    const [currentIndex, setCurrentIndex] = useState(threadMessages.length - 1); 
    const currentMsg = threadMessages[currentIndex];

    // Collect all attachments for the right panel
    const allAttachments: { msgId: string, att: Attachment }[] = useMemo(() => {
        return threadMessages.flatMap(m => (m.attachments || []).map(att => ({ msgId: m.id, att })));
    }, [threadMessages]);

    // Handle Actions inside modal (Local state for simplicity in this demo view)
    const [modalAttachments, setModalAttachments] = useState(allAttachments);
    const [actionState, setActionState] = useState<{ type: AttachmentActionType, attachment: Attachment, msgId: string } | null>(null);
    const { addToast } = useToast();

    // Sync if props change (though this is a static demo mostly)
    useEffect(() => {
        setModalAttachments(allAttachments);
    }, [allAttachments]);

    const handleConfirmAction = () => {
        if (!actionState) return;

        const { type, attachment } = actionState;
        
        if (type === 'CREATE_PROFILE') {
            addToast(`Profile creation started for ${attachment.name}`, 'success');
            addToast(`Activity Logged: User sent ${attachment.name} to parser`, 'info');
        } else if (type === 'MARK_SENSITIVE') {
            const isNowSensitive = !attachment.isSensitive;
            // Update local state to reflect change visually in the modal
            setModalAttachments(prev => prev.map(item => 
                item.att.id === attachment.id ? { ...item, att: { ...item.att, isSensitive: isNowSensitive } } : item
            ));
            addToast(isNowSensitive ? "Attachment marked as sensitive" : "Attachment unmarked as sensitive", "success");
            addToast(`Activity Logged: User marked ${attachment.name} as ${isNowSensitive ? 'Sensitive' : 'Normal'}`, 'info');
        } else if (type === 'DOWNLOAD') {
            addToast(`Downloading ${attachment.name}...`, 'success');
            addToast(`Activity Logged: User downloaded ${attachment.name}`, 'info');
        }

        setActionState(null);
    };

    const getConfirmationDetails = () => {
        if (!actionState) return { title: '', message: '', confirmText: '' };
        switch (actionState.type) {
            case 'CREATE_PROFILE':
                return {
                    title: 'Create Candidate Profile?',
                    message: `This will send "${actionState.attachment.name}" to our parsing engine to automatically create a new candidate profile. An activity log will be created.`,
                    confirmText: 'Create Profile'
                };
            case 'MARK_SENSITIVE':
                const isCurrentlySensitive = actionState.attachment.isSensitive;
                return {
                    title: isCurrentlySensitive ? 'Unmark as Sensitive?' : 'Mark as Sensitive Content?',
                    message: isCurrentlySensitive 
                        ? `This will make "${actionState.attachment.name}" visible to all users with access to this conversation. Access activity will be logged.`
                        : `This will block preview and download access for "${actionState.attachment.name}" to protect sensitive data. You can unmark it later. An activity log will be created.`,
                    confirmText: isCurrentlySensitive ? 'Unmark' : 'Mark Sensitive'
                };
            case 'DOWNLOAD':
                return {
                    title: 'Download Attachment?',
                    message: `You are about to download "${actionState.attachment.name}". This action will be logged in the candidate's activity history for compliance.`,
                    confirmText: 'Download File'
                };
        }
    };

    const confirmDetails = getConfirmationDetails();

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            
            <ConfirmationModal 
                isOpen={!!actionState}
                onClose={() => setActionState(null)}
                onConfirm={handleConfirmAction}
                title={confirmDetails.title}
                message={confirmDetails.message}
                confirmText={confirmDetails.confirmText}
            />

            <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
                
                {/* COLUMN 1: Email Reader (Carousel) */}
                <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 dark:border-slate-800">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                        <div>
                             <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg truncate max-w-md">{currentMsg.subject}</h3>
                             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full font-mono text-[10px]">{currentIndex + 1} of {threadMessages.length}</span>
                                <span>•</span>
                                <span>{new Date(currentMsg.timestamp).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</span>
                             </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentIndex === 0}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Previous Email"
                            >
                                <ChevronLeft size={20} className="text-slate-600 dark:text-slate-300"/>
                            </button>
                            <button 
                                onClick={() => setCurrentIndex(prev => Math.min(threadMessages.length - 1, prev + 1))}
                                disabled={currentIndex === threadMessages.length - 1}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Next Email"
                            >
                                <ChevronRight size={20} className="text-slate-600 dark:text-slate-300"/>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-4 mb-8">
                             <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-lg font-bold text-indigo-700 dark:text-indigo-300">
                                 {currentMsg.senderName?.charAt(0) || 'U'}
                             </div>
                             <div>
                                 <p className="font-bold text-slate-800 dark:text-slate-100 text-base">{currentMsg.senderName}</p>
                                 <p className="text-sm text-slate-500 dark:text-slate-400">{currentMsg.senderEmail || 'email@example.com'} <span className="mx-1">to</span> {currentMsg.recipient || 'Me'}</p>
                             </div>
                        </div>

                        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: currentMsg.content }} />
                        </div>
                        
                        {modalAttachments.filter(item => item.msgId === currentMsg.id).length > 0 && (
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Attachments in this email</h5>
                                <div className="flex flex-wrap gap-3">
                                    {modalAttachments.filter(item => item.msgId === currentMsg.id).map(({ att }, idx) => (
                                        <AttachmentItem 
                                            key={idx} 
                                            attachment={att} 
                                            onAction={(type, a) => setActionState({ type, attachment: a, msgId: currentMsg.id })}
                                            onDelete={() => onDeleteAttachment(currentMsg.id, att.id)} 
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUMN 2: Thread Attachments */}
                <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-950/50 flex flex-col border-l border-slate-200 dark:border-slate-800 md:h-auto h-1/3">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                        <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2">
                            <File size={16} /> Thread Attachments ({modalAttachments.length})
                        </h4>
                        <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                        {modalAttachments.length > 0 ? modalAttachments.map(({ msgId, att }, idx) => (
                            <AttachmentItem 
                                key={idx} 
                                attachment={att} 
                                onAction={(type, a) => setActionState({ type, attachment: a, msgId })}
                                onDelete={() => onDeleteAttachment(msgId, att.id)}
                            />
                        )) : (
                            <div className="text-center py-10 text-slate-400">
                                <File size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No attachments in this thread</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ChatArea = ({ 
    conversation, 
    onSendMessage, 
    onBack, 
    onToggleDetails, 
    onAssign,
    onUpdateLabels
}: ChatAreaProps) => {
  const { userProfile } = useUserProfile();
  const { addToast } = useToast();
  
  // Compose Workflow State
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Thread View State
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);
  const [viewingThread, setViewingThread] = useState<Message | null>(null); // For Modal

  // Action State for Confirmation Modal in main view
  const [pendingAction, setPendingAction] = useState<{ type: AttachmentActionType, attachment: Attachment, msgId: string } | null>(null);

  // UI States
  const [isLabelMenuOpen, setIsLabelMenuOpen] = useState(false);
  const [isAssignMenuOpen, setIsAssignMenuOpen] = useState(false);
  const [assignSearch, setAssignSearch] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages, expandedThreadId]); 

  const handleDeleteAttachment = (msgId: string, attId: string) => {
      // Mock deletion
      addToast("Attachment deleted", "success");
  };

  const confirmAttachmentAction = () => {
      if (!pendingAction) return;
      const { type, attachment } = pendingAction;

      if (type === 'CREATE_PROFILE') {
          addToast(`Profile creation started for ${attachment.name}`, 'success');
          addToast(`Activity Logged: User sent ${attachment.name} to parser`, 'info');
      } else if (type === 'MARK_SENSITIVE') {
          const isNowSensitive = !attachment.isSensitive;
          addToast(isNowSensitive ? "Attachment marked as sensitive" : "Attachment unmarked as sensitive", "success");
          addToast(`Activity Logged: User marked ${attachment.name} as ${isNowSensitive ? 'Sensitive' : 'Normal'}`, 'info');
      } else if (type === 'DOWNLOAD') {
          addToast(`Downloading ${attachment.name}...`, 'success');
          addToast(`Activity Logged: User downloaded ${attachment.name}`, 'info');
      }

      setPendingAction(null);
  };

  const getConfirmationDetails = () => {
        if (!pendingAction) return { title: '', message: '', confirmText: '' };
        switch (pendingAction.type) {
            case 'CREATE_PROFILE':
                return {
                    title: 'Create Candidate Profile?',
                    message: `This will send "${pendingAction.attachment.name}" to our parsing engine to automatically create a new candidate profile. An activity log will be created.`,
                    confirmText: 'Create Profile'
                };
            case 'MARK_SENSITIVE':
                const isCurrentlySensitive = pendingAction.attachment.isSensitive;
                return {
                    title: isCurrentlySensitive ? 'Unmark as Sensitive?' : 'Mark as Sensitive Content?',
                    message: isCurrentlySensitive 
                        ? `This will make "${pendingAction.attachment.name}" visible to all users with access to this conversation. Access activity will be logged.`
                        : `This will block preview and download access for "${pendingAction.attachment.name}" to protect sensitive data. You can unmark it later. An activity log will be created.`,
                    confirmText: isCurrentlySensitive ? 'Unmark' : 'Mark Sensitive'
                };
            case 'DOWNLOAD':
                return {
                    title: 'Download Attachment?',
                    message: `You are about to download "${pendingAction.attachment.name}". This action will be logged in the candidate's activity history for compliance.`,
                    confirmText: 'Download File'
                };
        }
    };

  const confirmDetails = getConfirmationDetails();

  const handleLabelToggle = (label: string) => {
      const currentLabels = conversation.labels || [];
      const newLabels = currentLabels.includes(label) 
        ? currentLabels.filter(l => l !== label) 
        : [...currentLabels, label];
      onUpdateLabels(newLabels);
  };

  const handleAssignUser = (user?: typeof MOCK_USERS_LIST[0]) => {
      if (user) {
          onAssign(user.id, user.name);
          addToast(`Assigned to ${user.name}`, "success");
      } else {
          onAssign(undefined, undefined);
          addToast("Conversation unassigned", "info");
      }
      setIsAssignMenuOpen(false);
  };

  const canEditNote = (note: Message) => {
      const isAdmin = userProfile.role.includes('Admin');
      const isCreator = note.senderId === 'user' && note.senderName === `${userProfile.firstName} ${userProfile.lastName}`; 
      return isAdmin || isCreator;
  };

  const handleDeleteNote = (id: string) => {
      addToast("Note deleted", "success");
  };

  const assignmentResults = MOCK_USERS_LIST.filter(u => 
      u.name.toLowerCase().includes(assignSearch.toLowerCase()) || 
      u.role.toLowerCase().includes(assignSearch.toLowerCase())
  );

  // Status Checks
  const isAllBlocked = conversation.communicationStatus === 'ALL_BLOCKED';

  // --- RENDER HELPERS ---

  const renderStatusTicks = (status: string) => {
      if (status === 'read') return <div className="flex -space-x-1 text-blue-500"><Check size={12} /><Check size={12} /></div>; // Blue Double
      if (status === 'delivered') return <div className="flex -space-x-1 text-slate-400"><Check size={12} /><Check size={12} /></div>; // Grey Double
      if (status === 'sent') return <Check size={12} className="text-slate-400" />; // Single Grey
      return <Clock size={12} className="text-slate-400" />; // Scheduled
  };

  const renderEmailThreadCard = (msg: Message, isUser: boolean) => {
      const isExpanded = expandedThreadId === msg.id;
      const avatarInitials = (msg.senderName || 'UNK').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const threadCount = msg.threadCount || 1;

      return (
        <div className={`mb-6 flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
            <div className={`relative max-w-[90%] w-full md:w-[500px] group transition-all duration-300 ${isExpanded ? 'z-20' : 'z-0'}`}>
                
                {/* Stacking Effect */}
                {threadCount > 1 && !isExpanded && (
                    <>
                        <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg -z-10 shadow-sm transform rotate-1"></div>
                        <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg -z-0 shadow-sm"></div>
                    </>
                )}

                {/* Main Card */}
                <div 
                    className={`bg-white dark:bg-slate-800 border rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md
                        ${isUser ? 'border-slate-200 dark:border-slate-700' : 'border-slate-200 dark:border-slate-700'}
                        ${isExpanded ? 'ring-2 ring-emerald-500 border-emerald-500' : ''}
                    `}
                    onClick={() => setExpandedThreadId(isExpanded ? null : msg.id)}
                >
                    {/* Header */}
                    <div className="px-4 py-3 flex gap-3 border-b border-slate-50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${isUser ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                            {avatarInitials}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-start">
                                 <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate pr-2">
                                     {msg.subject || 'No Subject'}
                                 </h4>
                                 {/* Thread Count Badge */}
                                 {threadCount > 1 && (
                                     <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setViewingThread(msg);
                                        }}
                                        className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 whitespace-nowrap transition-colors"
                                        title="View entire thread"
                                     >
                                         <Layers size={10} /> {threadCount} <span className="opacity-60 text-[9px]">View All</span>
                                     </button>
                                 )}
                             </div>
                             <div className="flex justify-between items-center mt-1">
                                 <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                     <span className="font-medium text-slate-700 dark:text-slate-300">{msg.senderName}</span>
                                     <span className="mx-1.5 text-slate-300">to</span>
                                     <span className="text-slate-500 dark:text-slate-400">{msg.recipient || 'Me'}</span>
                                 </p>
                                 <div className="flex items-center gap-1.5 pl-2 shrink-0">
                                     <span className="text-[10px] text-slate-400">
                                         {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                     </span>
                                     {isUser && renderStatusTicks(msg.status)}
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Content Preview */}
                    <div className="p-4 bg-white dark:bg-slate-800 relative">
                        {isExpanded ? (
                             // Expanded View
                             <div className="animate-in fade-in duration-300">
                                <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.content }} />
                                
                                {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                        {msg.attachments.map((att, i) => (
                                            <AttachmentItem 
                                                key={i} 
                                                attachment={att} 
                                                onAction={(type, a) => setPendingAction({ type, attachment: a, msgId: msg.id })}
                                                onDelete={() => handleDeleteAttachment(msg.id, att.id)} 
                                            />
                                        ))}
                                    </div>
                                )}

                                <div className="mt-4 flex justify-end">
                                    <button className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline" onClick={(e) => { e.stopPropagation(); setExpandedThreadId(null); }}>
                                        Collapse
                                    </button>
                                </div>
                             </div>
                        ) : (
                             // Collapsed View (Snippet)
                             <div>
                                 <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                     {msg.snippet || msg.content.replace(/<[^>]*>?/gm, '')}
                                     <span className="text-slate-400 tracking-widest ml-1">...</span>
                                 </p>
                                 <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-slate-800 to-transparent"></div>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      );
  };

  const renderSMSMessage = (msg: Message, isUser: boolean) => (
      <div className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <MessageSquare size={10} /> SMS
                  </span>
                  <span className="text-[10px] text-slate-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
              </div>
              <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                  isUser 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none'
              }`}>
                  {msg.content}
              </div>
              {isUser && (
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                      <span>{msg.status}</span>
                      {renderStatusTicks(msg.status)}
                  </div>
              )}
          </div>
      </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 relative">
        {/* Compose Modal */}
        <ComposeModal 
            isOpen={isComposeOpen}
            onClose={() => setIsComposeOpen(false)}
            onSend={(type, content, subject, isPrivate) => {
                onSendMessage(content, isPrivate || false, type as ChannelType, subject);
            }}
        />

        {/* Thread Modal */}
        {viewingThread && (
            <EmailThreadModal 
                message={viewingThread} 
                onClose={() => setViewingThread(null)}
                onDeleteAttachment={handleDeleteAttachment}
            />
        )}

        {/* Action Confirmation Modal */}
        <ConfirmationModal 
            isOpen={!!pendingAction}
            onClose={() => setPendingAction(null)}
            onConfirm={confirmAttachmentAction}
            title={confirmDetails.title}
            message={confirmDetails.message}
            confirmText={confirmDetails.confirmText}
        />

        {/* Header */}
        <div className="px-6 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm z-10 shrink-0">
            <div className="flex items-center gap-3">
                {onBack && (
                    <button onClick={onBack} className="md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                        <ChevronLeft size={20} />
                    </button>
                )}
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-bold text-indigo-700 dark:text-indigo-300 relative">
                    {conversation.contact.avatar}
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {conversation.contact.name}
                        {conversation.labels.map(l => (
                            <span key={l} className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                {l}
                            </span>
                        ))}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{conversation.contact.company}</span>
                        <span>•</span>
                        <span className={conversation.assigneeId ? "text-indigo-600 dark:text-indigo-400 font-medium" : "text-slate-400 italic"}>
                            {conversation.assigneeId ? `Assigned to ${conversation.assigneeName === `${userProfile.firstName} ${userProfile.lastName}` ? 'You' : conversation.assigneeName}` : 'Unassigned'}
                        </span>
                        
                        {/* Status Label in Header */}
                        {isAllBlocked && <span className="text-red-500 flex items-center gap-1 ml-2 font-bold"><AlertTriangle size={10}/> Blocked</span>}
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                 {/* Assignment Button & Dropdown */}
                 <div className="relative">
                     <button 
                        onClick={() => setIsAssignMenuOpen(!isAssignMenuOpen)}
                        className={`p-2 rounded-lg transition-colors ${conversation.assigneeId ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        title="Assign User"
                    >
                         <UserPlus size={18} />
                     </button>
                     {isAssignMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsAssignMenuOpen(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden flex flex-col">
                                <div className="p-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                    <div className="relative">
                                        <Search size={12} className="absolute left-2.5 top-2 text-slate-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Search user..." 
                                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-200"
                                            value={assignSearch}
                                            onChange={(e) => setAssignSearch(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                    <button 
                                        onClick={() => handleAssignUser(undefined)}
                                        className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-500 dark:text-slate-400 border-b border-slate-50 dark:border-slate-700"
                                    >
                                        <X size={12} /> Unassign
                                    </button>
                                    {assignmentResults.map(user => (
                                        <button 
                                            key={user.id}
                                            onClick={() => handleAssignUser(user)}
                                            className={`w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 ${conversation.assigneeId === user.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                                        >
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${user.color} text-white`}>
                                                {user.initials}
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`text-xs font-bold truncate ${conversation.assigneeId === user.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
                                                    {user.name} {user.id === userProfile.id && '(You)'}
                                                </p>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.role}</p>
                                            </div>
                                            {conversation.assigneeId === user.id && <CheckCircle size={12} className="text-indigo-500 ml-auto" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                     )}
                 </div>

                 {/* Label Dropdown */}
                 <div className="relative">
                    <button 
                        onClick={() => setIsLabelMenuOpen(!isLabelMenuOpen)}
                        className={`p-2 rounded-lg transition-colors ${conversation.labels.length > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        title="Manage Labels"
                    >
                        <Tag size={18} />
                    </button>
                    {isLabelMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsLabelMenuOpen(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-20 py-1">
                                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400">Apply Labels</div>
                                {AVAILABLE_LABELS.map(label => (
                                    <button 
                                        key={label}
                                        onClick={() => handleLabelToggle(label)}
                                        className="w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-200"
                                    >
                                        {label}
                                        {conversation.labels.includes(label) && <CheckCircle size={14} className="text-emerald-500" />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                 </div>

                 <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                 <button onClick={onToggleDetails} className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors" title="Contact Details">
                     <MoreHorizontal size={18} />
                 </button>
            </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-100/50 dark:bg-slate-900/50 pb-20">
            {conversation.messages.map((msg) => {
                const isUser = msg.senderId === 'user';
                const isPrivate = msg.isPrivate;

                if (isPrivate) {
                    return (
                        <div key={msg.id} className="flex justify-center mb-6">
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800 rounded-lg p-3 max-w-[80%] w-full shadow-sm">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <Lock size={12} className="text-yellow-600 dark:text-yellow-500" />
                                        <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">
                                            Private Note by {msg.senderName || 'Unknown'}
                                        </span>
                                        <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    {canEditNote(msg) && (
                                        <div className="flex gap-2">
                                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Edit2 size={12}/></button>
                                            <button onClick={() => handleDeleteNote(msg.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={12}/></button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    {/* Handle @mentions styling */}
                                    {msg.content.split(' ').map((word, i) => 
                                        word.startsWith('@') 
                                        ? <span key={i} className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1 rounded">{word} </span> 
                                        : word + ' '
                                    )}
                                </p>
                            </div>
                        </div>
                    );
                }

                if (msg.channel === 'Email' || msg.contentType === 'email_thread') {
                    return <React.Fragment key={msg.id}>{renderEmailThreadCard(msg, isUser)}</React.Fragment>;
                } else {
                    return <React.Fragment key={msg.id}>{renderSMSMessage(msg, isUser)}</React.Fragment>;
                }
            })}
            <div ref={messagesEndRef} />
        </div>

        {/* FAB Compose Button */}
        <div className="absolute bottom-6 right-6 z-20">
             <button 
                onClick={() => setIsComposeOpen(true)}
                disabled={isAllBlocked}
                className={`flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${isAllBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
                 <Edit3 size={20} />
                 <span className="font-bold pr-1">Compose</span>
             </button>
        </div>
    </div>
  );
};
