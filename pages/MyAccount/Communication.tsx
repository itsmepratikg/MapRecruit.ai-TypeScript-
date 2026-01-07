
import React, { useState, useRef } from 'react';
import { 
  Mail, MessageSquare, Phone, CheckCircle, Trash2, 
  Bold, Italic, Underline, List, Link as LinkIcon, AlignLeft, 
  AlignCenter, AlignRight, Type, Save, AlertCircle, Edit2, X
} from '../../components/Icons';
import { useToast } from '../../components/Toast';

// --- Types ---
interface CommunicationPrefs {
  defaultEmail: string;
  defaultSmsPhone: string;
  defaultCallPhone: string;
  emailSignature: string;
  autoReplyText: string;
  autoReplyEnabled: boolean;
}

// --- Mock Data ---
const AVAILABLE_EMAILS = [
  { id: '1', email: 'pratik.gaurav@trcdemo.com', verified: true, label: 'Work' },
  { id: '2', email: 'pratik.g@personal.com', verified: true, label: 'Personal' },
];

const AVAILABLE_PHONES = [
  { id: '1', number: '+1 (555) 012-3456', verified: true, label: 'Office' },
  { id: '2', number: '+1 (555) 987-6543', verified: true, label: 'Mobile' },
  { id: '3', number: '+1 (404) 555-0199', verified: true, label: 'Direct' },
];

// --- Simple Rich Text Editor Component ---
const RichTextEditor = ({ 
    value, 
    onChange, 
    label, 
    placeholder, 
    disabled 
}: { 
    value: string, 
    onChange: (val: string) => void, 
    label: string, 
    placeholder?: string,
    disabled?: boolean
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTag = (tag: string, startTag: string, endTag: string) => {
    if (disabled || !textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = `${before}${startTag}${selection}${endTag}${after}`;
    
    onChange(newText);
    
    // Restore focus and selection (roughly)
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + startTag.length, end + startTag.length);
    }, 0);
  };

  return (
    <div className={`border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 transition-all ${disabled ? 'opacity-60 pointer-events-none bg-slate-50 dark:bg-slate-900' : 'focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500'}`}>
      <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 px-4 py-2 flex items-center justify-between">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{label}</label>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => insertTag('b', '<b>', '</b>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><Bold size={14} /></button>
          <button type="button" onClick={() => insertTag('i', '<i>', '</i>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><Italic size={14} /></button>
          <button type="button" onClick={() => insertTag('u', '<u>', '</u>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><Underline size={14} /></button>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
          <button type="button" onClick={() => insertTag('left', '<div style="text-align:left">', '</div>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><AlignLeft size={14} /></button>
          <button type="button" onClick={() => insertTag('center', '<div style="text-align:center">', '</div>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><AlignCenter size={14} /></button>
          <button type="button" onClick={() => insertTag('right', '<div style="text-align:right">', '</div>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><AlignRight size={14} /></button>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
          <button type="button" onClick={() => insertTag('ul', '<ul>\n<li>', '</li>\n</ul>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><List size={14} /></button>
          <button type="button" onClick={() => insertTag('a', '<a href="#">', '</a>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><LinkIcon size={14} /></button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        className="w-full h-40 p-4 text-sm bg-transparent outline-none resize-none dark:text-slate-200 placeholder:text-slate-400 font-mono"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      ></textarea>
      <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-slate-400">
        <span>HTML Mode Available</span>
        <span>{value.length} chars</span>
      </div>
    </div>
  );
};

export const Communication = () => {
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // State
  const [prefs, setPrefs] = useState<CommunicationPrefs>({
    defaultEmail: AVAILABLE_EMAILS[0].email,
    defaultSmsPhone: AVAILABLE_PHONES[0].number,
    defaultCallPhone: AVAILABLE_PHONES[0].number,
    emailSignature: "Regards,\n\nPratik Gaurav\nProduct Admin | TRC Talent Solutions\n+1 (555) 012-3456 | www.maprecruit.ai",
    autoReplyText: "Hi, thanks for reaching out! I'm currently away but will get back to you as soon as possible.",
    autoReplyEnabled: true
  });

  const handleSave = () => {
    // In a real app, this would save to backend/localstorage
    console.log("Saving preferences:", prefs);
    addToast("Communication preferences updated successfully", "success");
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Revert logic would go here if we were storing original state separately
    setIsEditing(false);
    addToast("Changes discarded", "info");
  };

  return (
    <div className="p-8 lg:p-12">
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-4 sticky top-0 bg-slate-50 dark:bg-slate-900 z-20 pt-2">
         <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <MessageSquare size={20} className="text-emerald-500"/> Communication
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your sender IDs and messaging defaults.</p>
         </div>
         <div className="flex gap-3">
            {isEditing ? (
                <>
                    <button 
                        onClick={handleCancel}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </>
            ) : (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                    <Edit2 size={16} /> Edit
                </button>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Sender IDs */}
        <div className="space-y-8">
            
            {/* Email Config */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Mail size={18} className="text-blue-500" /> Default Sender Email
                    </h3>
                    <div className="text-xs text-slate-400 italic">
                        Managed by Admin
                    </div>
                </div>
                <div className={`space-y-3 ${!isEditing ? 'opacity-70 pointer-events-none' : ''}`}>
                    {AVAILABLE_EMAILS.map((item) => (
                        <label 
                            key={item.id} 
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${prefs.defaultEmail === item.email ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${prefs.defaultEmail === item.email ? 'border-blue-500 bg-blue-500' : 'border-slate-400'}`}>
                                    {prefs.defaultEmail === item.email && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                </div>
                                <input 
                                    type="radio" 
                                    name="defaultEmail" 
                                    className="hidden"
                                    checked={prefs.defaultEmail === item.email}
                                    onChange={() => setPrefs({...prefs, defaultEmail: item.email})}
                                    disabled={!isEditing}
                                />
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.email}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide">{item.label}</span>
                                        {item.verified && <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded flex items-center gap-0.5"><CheckCircle size={8}/> Verified</span>}
                                    </div>
                                </div>
                            </div>
                            {prefs.defaultEmail === item.email && <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm">Default</span>}
                        </label>
                    ))}
                </div>
            </div>

            {/* Phone Config (SMS & Calls) */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Phone size={18} className="text-purple-500" /> Phone Numbers
                    </h3>
                    <div className="text-xs text-slate-400 italic">
                        Managed by Admin
                    </div>
                </div>

                {/* SMS Section */}
                <div className={`mb-6 ${!isEditing ? 'opacity-70 pointer-events-none' : ''}`}>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <MessageSquare size={12} /> Default for SMS
                    </h4>
                    <div className="space-y-2">
                        {AVAILABLE_PHONES.map((item) => (
                            <label 
                                key={`sms-${item.id}`} 
                                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${prefs.defaultSmsPhone === item.number ? 'bg-purple-50 dark:bg-purple-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${prefs.defaultSmsPhone === item.number ? 'border-purple-500 bg-purple-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                    {prefs.defaultSmsPhone === item.number && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                </div>
                                <input 
                                    type="radio" 
                                    name="defaultSms" 
                                    className="hidden"
                                    checked={prefs.defaultSmsPhone === item.number}
                                    onChange={() => setPrefs({...prefs, defaultSmsPhone: item.number})}
                                    disabled={!isEditing}
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300 font-mono">{item.number}</span>
                                <span className="text-[10px] text-slate-400 uppercase ml-auto">{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Calling Section */}
                <div className={`pt-4 border-t border-slate-100 dark:border-slate-700 ${!isEditing ? 'opacity-70 pointer-events-none' : ''}`}>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <Phone size={12} /> Default for Calls
                    </h4>
                    <div className="space-y-2">
                        {AVAILABLE_PHONES.map((item) => (
                            <label 
                                key={`call-${item.id}`} 
                                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${prefs.defaultCallPhone === item.number ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${prefs.defaultCallPhone === item.number ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                    {prefs.defaultCallPhone === item.number && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                </div>
                                <input 
                                    type="radio" 
                                    name="defaultCall" 
                                    className="hidden"
                                    checked={prefs.defaultCallPhone === item.number}
                                    onChange={() => setPrefs({...prefs, defaultCallPhone: item.number})}
                                    disabled={!isEditing}
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300 font-mono">{item.number}</span>
                                <span className="text-[10px] text-slate-400 uppercase ml-auto">{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

        </div>

        {/* RIGHT COLUMN: Editors */}
        <div className="space-y-8">
            
            {/* Email Signature */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <Type size={18} className="text-slate-500" /> Email Signature
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Automatically appended to all your outgoing emails.</p>
                    </div>
                </div>
                
                <RichTextEditor 
                    label="Signature Editor" 
                    value={prefs.emailSignature} 
                    onChange={(val) => setPrefs({...prefs, emailSignature: val})}
                    placeholder="Enter your email signature here..."
                    disabled={!isEditing}
                />
                
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                    <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Tip: You can use standard HTML tags for advanced formatting. Images should be hosted externally.
                    </p>
                </div>
            </div>

            {/* Talent Chat Auto-Reply */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <MessageSquare size={18} className="text-green-500" /> Talent Chat Auto-Reply
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sent when you are offline or away.</p>
                    </div>
                    <label className={`relative inline-flex items-center cursor-pointer ${!isEditing ? 'opacity-60 pointer-events-none' : ''}`}>
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={prefs.autoReplyEnabled} 
                            onChange={(e) => setPrefs({...prefs, autoReplyEnabled: e.target.checked})}
                            disabled={!isEditing}
                        />
                        <div className="w-9 h-5 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                </div>

                <div className={`relative ${!isEditing ? 'opacity-60 pointer-events-none' : ''}`}>
                    <textarea 
                        className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all dark:text-slate-200 resize-none"
                        value={prefs.autoReplyText}
                        onChange={(e) => setPrefs({...prefs, autoReplyText: e.target.value})}
                        placeholder="Type your auto-reply message..."
                        disabled={!isEditing}
                    ></textarea>
                    <div className="absolute bottom-3 right-3 text-xs text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700 shadow-sm">
                        {prefs.autoReplyText.length} chars
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
    </div>
  );
};
