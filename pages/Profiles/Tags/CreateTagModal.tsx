
import React, { useState, useEffect } from 'react';
import { X, Tag, FileText, Type, CheckCircle, Globe, Building2, User, Lock, Save } from '../../../components/Icons';
import { useToast } from '../../../components/Toast';
import { AccessControlModal } from '../../../components/AccessControlModal';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { AccessSettings, Tag as TagType } from '../../../types';

interface CreateTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tagData: Partial<TagType>) => void;
  initialData?: TagType | null;
}

export const CreateTagModal = ({ isOpen, onClose, onSubmit, initialData }: CreateTagModalProps) => {
  const { addToast } = useToast();
  const { userProfile } = useUserProfile();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Access Settings State
  const [accessSettings, setAccessSettings] = useState<AccessSettings>({
    level: 'PRIVATE',
    ownerId: userProfile.id || 'usr_123',
    sharedWith: []
  });

  // Populate form when initialData changes or modal opens
  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description || '');
            setAccessSettings(initialData.access || {
                level: 'PRIVATE',
                ownerId: userProfile.id || 'usr_123',
                sharedWith: []
            });
        } else {
            // Reset for create mode
            setName('');
            setDescription('');
            setAccessSettings({ level: 'PRIVATE', ownerId: userProfile.id || 'usr_123', sharedWith: [] });
        }
    }
  }, [isOpen, initialData, userProfile.id]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
        addToast("Tag name is required", "error");
        return;
    }
    
    // Construct the payload
    const payload: Partial<TagType> = {
        name,
        description,
        access: accessSettings,
        updatedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    if (!initialData) {
        // New Tag specific fields
        payload.profilesCount = 0;
        payload.createdDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        payload.createdBy = `${userProfile.firstName} ${userProfile.lastName}`;
    } else {
        payload.id = initialData.id;
    }

    onSubmit(payload);
    onClose();
  };

  // Helper to display access status
  const getAccessLabel = () => {
    if (accessSettings.level === 'COMPANY') return { label: 'Public (Company)', icon: Globe, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' };
    if (accessSettings.level === 'CLIENT') return { label: 'Restricted (Client)', icon: Building2, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' };
    if (accessSettings.sharedWith.length > 0) return { label: `Shared with ${accessSettings.sharedWith.length} people`, icon: User, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' };
    return { label: 'Private (Only You)', icon: Lock, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800' };
  };

  const accessInfo = getAccessLabel();
  const AccessIcon = accessInfo.icon;
  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* ACCESS CONTROL MODAL (Stacked) */}
      <AccessControlModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        entityName={name || (isEdit ? "Edit Tag" : "New Tag")}
        currentSettings={accessSettings}
        onSave={(settings) => setAccessSettings(settings)}
        currentUser={{ id: userProfile.id || 'usr_123', name: `${userProfile.firstName} ${userProfile.lastName}` }}
      />

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Tag size={20} className="text-emerald-600 dark:text-emerald-400" />
                {isEdit ? 'Edit Tag' : 'Create New Tag'}
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X size={20} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
                    <Type size={14} /> Tag Name <span className="text-red-500">*</span>
                </label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Java Expert, Q3 Hiring"
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 transition-all"
                    autoFocus
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
                    <FileText size={14} /> Description
                </label>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what this tag represents..."
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 transition-all resize-none"
                />
            </div>

            {/* Access Control Section */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
                    Access Level
                </label>
                <div className="flex items-center gap-3">
                    <div className={`flex-1 px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center gap-2 ${accessInfo.color} border-transparent transition-colors`}>
                        <AccessIcon size={16} />
                        <span className="text-sm font-medium">{accessInfo.label}</span>
                    </div>
                    <button 
                        type="button"
                        onClick={() => setIsShareModalOpen(true)}
                        className="px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Change
                    </button>
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
                >
                    {isEdit ? <Save size={16} /> : <CheckCircle size={16} />} 
                    {isEdit ? 'Save Changes' : 'Create Tag'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};
