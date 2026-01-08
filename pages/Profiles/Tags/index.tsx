
import React, { useState, useMemo } from 'react';
import { Tag, Search, PlusCircle, User, Edit2, Trash2, Tag as TagIcon, BarChart2 } from '../../../components/Icons';
import { MOCK_TAGS } from '../../../data';
import { AccessControlModal } from '../../../components/AccessControlModal';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useToast } from '../../../components/Toast';
import { CreateTagModal } from './CreateTagModal';
import { TagDetailView } from './TagDetailView';
import { canEdit } from '../../../utils/accessControl';
import { Tag as TagType } from '../../../types';

const TagsMetricView = ({ tags }: { tags: TagType[] }) => {
    // Sort by usage (profilesCount)
    const topTags = [...tags].sort((a, b) => b.profilesCount - a.profilesCount).slice(0, 4);
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {topTags.map((tag, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                            <Tag size={18} />
                        </div>
                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{tag.profilesCount}</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate" title={tag.name}>{tag.name}</h4>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (tag.profilesCount / 300) * 100)}%` }}></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const TagsView = () => {
  const { userProfile } = useUserProfile();
  const { addToast } = useToast();
  
  // State Management
  const [tags, setTags] = useState<TagType[]>(MOCK_TAGS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  
  const [deletingTag, setDeletingTag] = useState<TagType | null>(null);
  const [sharingModalTag, setSharingModalTag] = useState<TagType | null>(null);
  
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null);

  // Filter Tags
  const filteredTags = useMemo(() => {
      if (!searchQuery) return tags;
      return tags.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, tags]);

  // --- Handlers ---

  const handleCreateOrUpdate = (tagData: Partial<TagType>) => {
      if (editingTag) {
          // Update
          setTags(prev => prev.map(t => t.id === editingTag.id ? { ...t, ...tagData } as TagType : t));
          addToast(`Tag "${tagData.name}" updated successfully`, "success");
      } else {
          // Create
          const newTag = {
              id: Date.now(), // Generate mock ID
              ...tagData
          } as TagType;
          setTags(prev => [newTag, ...prev]);
          addToast(`Tag "${tagData.name}" created successfully`, "success");
      }
      setEditingTag(null);
  };

  const handleEditClick = (tag: TagType) => {
      // Access check could go here if needed, relying on UI disabled state mostly
      if (!canEdit({ id: userProfile.id || 'usr_123' }, tag.access)) {
          addToast("You do not have permission to edit this tag.", "error");
          return;
      }
      setEditingTag(tag);
      setIsCreateModalOpen(true);
  };

  const handleDeleteClick = (tag: TagType) => {
      if (!canEdit({ id: userProfile.id || 'usr_123' }, tag.access)) {
          addToast("You do not have permission to delete this tag.", "error");
          return;
      }
      setDeletingTag(tag);
  };

  const confirmDelete = () => {
      if (!deletingTag) return;
      setTags(prev => prev.filter(t => t.id !== deletingTag.id));
      addToast(`Tag "${deletingTag.name}" deleted successfully`, "success");
      setDeletingTag(null);
  };

  const handleShareClick = (tag: TagType) => {
      // Check permissions logic: View-only users can't modify sharing
      const user = { id: userProfile.id || 'usr_123' };
      if (!canEdit(user, tag.access)) {
          addToast("You do not have permission to modify access settings for this tag.", "error");
          return;
      }
      setSharingModalTag(tag);
  };

  const handleShareSave = (settings: any) => {
      if (sharingModalTag) {
          setTags(prev => prev.map(t => t.id === sharingModalTag.id ? { ...t, access: settings } : t));
          addToast("Tag access updated", "success");
      }
  };

  if (selectedTag) {
      return <TagDetailView tag={selectedTag} onBack={() => setSelectedTag(null)} />;
  }

  return (
    <div className="h-full flex flex-col bg-slate-50/50 dark:bg-slate-900/50 p-6 lg:p-8 overflow-y-auto">
        
        {/* Create/Edit Modal */}
        <CreateTagModal 
            isOpen={isCreateModalOpen} 
            onClose={() => { setIsCreateModalOpen(false); setEditingTag(null); }} 
            onSubmit={handleCreateOrUpdate}
            initialData={editingTag}
        />
        
        {/* Share Modal */}
        {sharingModalTag && (
            <AccessControlModal 
                isOpen={!!sharingModalTag}
                onClose={() => setSharingModalTag(null)}
                entityName={`Tag: ${sharingModalTag.name}`}
                currentSettings={sharingModalTag.access}
                onSave={handleShareSave}
                currentUser={{ id: userProfile.id || 'usr_123', name: `${userProfile.firstName} ${userProfile.lastName}` }}
            />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal 
            isOpen={!!deletingTag}
            onClose={() => setDeletingTag(null)}
            onConfirm={confirmDelete}
            title="Delete Tag?"
            message={`Are you sure you want to delete "${deletingTag?.name}"? This action cannot be undone and will remove the tag from all associated profiles.`}
            confirmText="Delete Tag"
            isDelete={true}
        />

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <TagIcon size={24} className="text-emerald-600 dark:text-emerald-400" /> Tags Management
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Organize and track candidates using custom tags.</p>
            </div>
            <button 
                onClick={() => { setEditingTag(null); setIsCreateModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition-colors text-sm"
            >
                <PlusCircle size={16} /> Create Tag
            </button>
        </div>

        {/* Metrics */}
        <div className="mb-2">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <BarChart2 size={14} /> Top Utilized Tags
            </h3>
            <TagsMetricView tags={tags} />
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
            {/* Search Bar */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="relative max-w-md">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search tags..." 
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-200 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-6 py-4">Tag Name</th>
                            <th className="px-6 py-4 text-center">Profiles Count</th>
                            <th className="px-6 py-4">Created By</th>
                            <th className="px-6 py-4">Created Date</th>
                            <th className="px-6 py-4">Updated Date</th>
                            <th className="px-6 py-4">Shared With</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredTags.map(tag => (
                            <tr key={tag.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => setSelectedTag(tag)}
                                        className="font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline flex items-center gap-2"
                                    >
                                        <Tag size={14} className="text-slate-400" /> {tag.name}
                                    </button>
                                    {tag.description && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{tag.description}</p>}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full text-xs font-mono font-bold">{tag.profilesCount}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                                            {tag.createdBy.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <span className="text-slate-600 dark:text-slate-300">{tag.createdBy}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{tag.createdDate}</td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{tag.updatedDate}</td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => handleShareClick(tag)}
                                        className="flex items-center -space-x-2 hover:opacity-80 transition-opacity"
                                        title="Manage Access"
                                    >
                                        {/* Mocking specific shared users visualization based on access level */}
                                        {tag.access.level === 'COMPANY' && (
                                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-bold z-10">
                                                ALL
                                            </div>
                                        )}
                                        {tag.access.level === 'PRIVATE' && (
                                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-bold z-10">
                                                <User size={14} />
                                            </div>
                                        )}
                                        {tag.access.sharedWith.slice(0, 2).map((user: any, i: number) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold z-[5]">
                                                {user.avatar || user.entityName.charAt(0)}
                                            </div>
                                        ))}
                                        {(tag.access.sharedWith.length > 2) && (
                                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-bold z-0">
                                                +{tag.access.sharedWith.length - 2}
                                            </div>
                                        )}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEditClick(tag)}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                            title="Edit Tag"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(tag)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                            title="Delete Tag"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredTags.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">No tags found matching your search.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};
