
import React, { useState, useMemo, useEffect } from 'react';
import {
   Tag, Search, ChevronLeft, UserPlus,
   Mail, Link, Sparkles, CheckSquare, Square, X, Filter,
   Share2, Send, Briefcase
} from '../../../components/Icons';
import { campaignService } from '../../../services/api';
import { useToast } from '../../../components/Toast';
import { AccessControlModal } from '../../../components/AccessControlModal';
import { useUserProfile } from '../../../hooks/useUserProfile';

// Reusing ActionModal for consistency
const ActionModal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
   if (!isOpen) return null;
   return (
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
               <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
               <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  <X size={20} />
               </button>
            </div>
            <div className="p-6">
               {children}
            </div>
         </div>
      </div>
   );
};

export const TagDetailView = ({ tag, onBack }: { tag: any, onBack: () => void }) => {
   const { addToast } = useToast();
   const { userProfile } = useUserProfile();
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
   const [isShareModalOpen, setIsShareModalOpen] = useState(false);

   // Modal States
   const [actionType, setActionType] = useState<'COMM' | 'ATTACH_CAMPAIGN' | 'REFERRAL' | null>(null);
   const [activeCommTab, setActiveCommTab] = useState<'EMAIL' | 'SMS'>('EMAIL');
   const [campaigns, setCampaigns] = useState<any[]>([]);

   useEffect(() => {
      const fetchCampaigns = async () => {
         try {
            const data = await campaignService.getAll();
            setCampaigns(data.filter((c: any) => {
               const status = c.schemaConfig?.mainSchema?.status || (c.status === true || c.status === 'Active' ? 'Active' : 'Closed');
               return status === 'Active';
            }));
         } catch (err) {
            console.error("Failed to fetch campaigns", err);
         }
      };
      fetchCampaigns();
   }, []);

   // Data Filtering (Mock logic: Filter profiles containing similar keywords or all profiles for demo)
   const filteredProfiles = useMemo(() => {
      let profiles: any[] = [];
      // In a real app, we'd filter profiles that actually have this tag ID.
      // For mock, just filtering by search text.
      if (searchQuery) {
         const lower = searchQuery.toLowerCase();
         profiles = profiles.filter(p =>
            p.name.toLowerCase().includes(lower) ||
            p.title.toLowerCase().includes(lower) ||
            p.location.toLowerCase().includes(lower) ||
            p.skills.some(s => s.toLowerCase().includes(lower))
         );
      }
      return profiles;
   }, [searchQuery]);

   const toggleSelection = (id: number) => {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
   };

   const toggleSelectAll = () => {
      if (selectedIds.size === filteredProfiles.length) {
         setSelectedIds(new Set());
      } else {
         setSelectedIds(new Set(filteredProfiles.map(p => p.id)));
      }
   };

   const executeAction = () => {
      addToast("Action completed successfully!", "success");
      setActionType(null);
      setSelectedIds(new Set());
   };

   return (
      <div className="h-full flex flex-col bg-white dark:bg-slate-900">

         {/* ACCESS CONTROL MODAL */}
         <AccessControlModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            entityName={tag.name}
            currentSettings={tag.access}
            onSave={(settings) => {
               console.log("Saved tag sharing settings:", settings);
               addToast("Tag sharing settings updated", "success");
            }}
            currentUser={{ id: userProfile.id || 'usr_123', name: `${userProfile.firstName} ${userProfile.lastName}` }}
         />

         {/* MODALS */}
         <ActionModal isOpen={actionType === 'ATTACH_CAMPAIGN'} onClose={() => setActionType(null)} title="Attach to Campaign">
            <div className="space-y-4">
               <p className="text-sm text-slate-600 dark:text-slate-300">
                  Attaching <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedIds.size}</span> profiles to:
               </p>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Select Campaign</label>
                  <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:border-emerald-500 dark:text-slate-200">
                     <option>Select a campaign...</option>
                     {campaigns.map(c => (
                        <option key={c._id?.$oid || c._id} value={c._id?.$oid || c._id}>
                           {c.schemaConfig?.mainSchema?.title || c.title || 'Untitled'} ({c.migrationMeta?.jobID || '---'})
                        </option>
                     ))}
                  </select>
               </div>
               <div className="pt-4 flex justify-end gap-3">
                  <button onClick={() => setActionType(null)} className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-300">Cancel</button>
                  <button onClick={executeAction} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm">Attach</button>
               </div>
            </div>
         </ActionModal>

         <ActionModal isOpen={actionType === 'COMM'} onClose={() => setActionType(null)} title="Send Communication">
            <div className="space-y-4">
               <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg w-fit">
                  <button
                     onClick={() => setActiveCommTab('EMAIL')}
                     className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeCommTab === 'EMAIL' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                  >
                     Email
                  </button>
                  <button
                     onClick={() => setActiveCommTab('SMS')}
                     className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeCommTab === 'SMS' ? 'bg-white dark:bg-slate-600 shadow-sm text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                  >
                     SMS
                  </button>
               </div>

               <p className="text-sm text-slate-600 dark:text-slate-300">
                  Sending to <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedIds.size}</span> recipients.
               </p>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                     {activeCommTab === 'EMAIL' ? 'Subject' : 'Message Body'}
                  </label>
                  {activeCommTab === 'EMAIL' && (
                     <input type="text" placeholder="Enter email subject..." className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:border-blue-500 dark:text-slate-200 mb-2" />
                  )}
                  <textarea
                     className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:border-blue-500 resize-none h-32 dark:text-slate-200"
                     placeholder={activeCommTab === 'EMAIL' ? "Compose your email..." : "Type your SMS message..."}
                  ></textarea>
               </div>

               <div className="pt-4 flex justify-end gap-3">
                  <button onClick={() => setActionType(null)} className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-300">Cancel</button>
                  <button onClick={executeAction} className={`px-4 py-2 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 ${activeCommTab === 'EMAIL' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
                     <Send size={14} /> Send {activeCommTab}
                  </button>
               </div>
            </div>
         </ActionModal>

         {/* HEADER */}
         <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 sticky top-0 z-20">
            <div className="flex items-center gap-3">
               <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                  <ChevronLeft size={20} />
               </button>
               <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                     <Tag size={20} className="text-emerald-600 dark:text-emerald-400" />
                     {tag.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                     <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">Tag</span>
                     <span>•</span>
                     <span>{filteredProfiles.length} Profiles</span>
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
               <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex-1 md:flex-none px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
               >
                  <Share2 size={16} /> Share
               </button>

               <button
                  onClick={() => { setSelectedIds(new Set(filteredProfiles.map(p => p.id))); setActionType('ATTACH_CAMPAIGN'); }}
                  className="flex-1 md:flex-none px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
               >
                  <Briefcase size={16} /> Attach to Campaign
               </button>
               <button className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
                  <UserPlus size={16} /> Add Profile
               </button>
            </div>
         </div>

         {/* SEARCH BAR */}
         <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full group">
               <Sparkles size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 transition-colors group-focus-within:text-emerald-600" />
               <input
                  type="text"
                  placeholder="Search profiles with this tag..."
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all dark:text-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            <div className="flex items-center gap-2">
               <button className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors" title="Filters">
                  <Filter size={16} />
               </button>
            </div>
         </div>

         {/* ACTION BAR (Visible on Selection) */}
         {selectedIds.size > 0 && (
            <div className="px-6 py-2 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800 flex flex-col sm:flex-row justify-between items-center gap-3 animate-in slide-in-from-top-1">
               <div className="flex items-center gap-2 text-sm text-indigo-900 dark:text-indigo-200">
                  <span className="font-bold bg-indigo-200 dark:bg-indigo-800 px-2 py-0.5 rounded-full text-xs">{selectedIds.size}</span>
                  <span>Selected</span>
                  <button onClick={() => setSelectedIds(new Set())} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline ml-2">Clear</button>
               </div>
               <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                  <button onClick={() => setActionType('ATTACH_CAMPAIGN')} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 flex items-center gap-1 whitespace-nowrap transition-colors">
                     <Briefcase size={14} /> Attach to Campaign
                  </button>
                  <div className="h-4 w-px bg-indigo-200 dark:bg-indigo-800 mx-1"></div>
                  <button onClick={() => setActionType('COMM')} className="px-3 py-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-1 whitespace-nowrap transition-colors">
                     <Mail size={14} /> Communication
                  </button>
                  <button onClick={() => setActionType('REFERRAL')} className="px-3 py-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-1 whitespace-nowrap transition-colors">
                     <Share2 size={14} /> Referral
                  </button>
               </div>
            </div>
         )}

         {/* TABLE */}
         <div className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-900/50 p-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-medium">
                     <tr>
                        <th className="px-4 py-3 w-12 text-center">
                           <button onClick={toggleSelectAll} className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                              {selectedIds.size === filteredProfiles.length && filteredProfiles.length > 0 ? <CheckSquare size={18} className="text-emerald-600 dark:text-emerald-400" /> : <Square size={18} />}
                           </button>
                        </th>
                        <th className="px-4 py-3">Candidate</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Availability</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                     {filteredProfiles.map((profile) => {
                        const isSelected = selectedIds.has(profile.id as number);
                        return (
                           <tr key={profile.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group ${isSelected ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                              <td className="px-4 py-3 text-center">
                                 <button onClick={() => toggleSelection(profile.id as number)} className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                                    {isSelected ? <CheckSquare size={18} className="text-emerald-600 dark:text-emerald-400" /> : <Square size={18} />}
                                 </button>
                              </td>
                              <td className="px-4 py-3">
                                 <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300`}>
                                       {profile.avatar}
                                    </div>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{profile.name}</span>
                                 </div>
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{profile.title}</td>
                              <td className="px-4 py-3">
                                 <span className={`px-2 py-0.5 rounded text-xs font-medium border ${profile.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}`}>
                                    {profile.status}
                                 </span>
                              </td>
                              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{profile.availability}</td>
                           </tr>
                        );
                     })}
                     {filteredProfiles.length === 0 && (
                        <tr>
                           <td colSpan={5} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center gap-2">
                                 <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                    <Search size={24} />
                                 </div>
                                 <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No profiles found</p>
                                 <p className="text-xs text-slate-400">Try adjusting your search query.</p>
                              </div>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};
