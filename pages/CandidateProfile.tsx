import React, { useState, useRef, useEffect } from 'react';
import {
  User, FileText, Briefcase, Activity, MessageSquare,
  Users, ThumbsUp, Video, Mail, Phone, Linkedin,
  ChevronLeft, MoreHorizontal, Minimize2, HelpCircle,
  FileEdit, Folder, Copy, MessageCircle, MapPin, CheckCircle, Tag as TagIcon
} from '../components/Icons';
import { ActionIcons, StatusBadge, EmptyView } from '../components/Common';
import { CANDIDATE, FULL_PROFILE_DATA } from '../data';
import { InterviewFormContent } from '../components/InterviewComponents';
import { CampaignsView, CampaignDetailView } from '../components/ProfileCampaigns';
import { InterviewsView } from '../components/ProfileInterviews';
import { ProfileDetails, ActivitiesView, TalentChatView, RecommendedView, SimilarProfilesView } from '../components/ProfileViews';
import { EditProfileModal } from '../components/EditProfileModal'; // Import Modal
import { ExportProfileModal } from '../components/ExportProfileModal'; // Import Export Modal
import { HeroWidgets } from '../components/HeroWidgets'; // Import Widgets
import { profileService } from '../services/api';
import { useToast } from '../components/Toast';

import { LocalMatchAnalysisModal } from '../components/LocalMatchAnalysisModal';

import { useParams } from 'react-router-dom';
import { useCandidateProfile } from '../hooks/useCandidateProfile';

export const CandidateProfile = ({ activeTab }: { activeTab: string }) => {
  const { id } = useParams<{ id: string }>();
  const { profile: liveData, loading, error, refreshProfile } = useCandidateProfile(id || null); // Ensure hook exports refresh
  const { addToast } = useToast();

  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // States for Modals/Drill-downs
  const [previewCampaign, setPreviewCampaign] = useState<any>(null);
  const [maximizedTemplate, setMaximizedTemplate] = useState<any>(null);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [showMatchScore, setShowMatchScore] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit State
  const [editModalTab, setEditModalTab] = useState('BASIC');
  const [shortlistStatus, setShortlistStatus] = useState<'shortlisted' | 'rejected' | 'none'>('none');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Extract Profile Data from liveData (MongoDB Schema)
  const resumeDetails = liveData || {};
  const profileResume = resumeDetails.resume || {};
  const profileBasic = profileResume.profile || {};
  const profileSummary = profileResume.professionalSummary || {};

  const candidateName = profileBasic.fullName || "Loading...";
  const candidateRole = profileSummary.currentRole?.jobTitle || "No Title";
  const candidateLocation = profileBasic.locations?.[0]?.text || "No Location";
  const candidateStatus = resumeDetails.personnelStatus || "Pending";
  const candidateType = resumeDetails.employmentStatus || "N/A";
  const candidateAvailability = resumeDetails.availability || "N/A";

  // Tag handling
  const tags = resumeDetails.tagID || [];
  const displayTags = tags.map((t: any) => t.name || t.text).filter(Boolean);

  // Widget Data & Meta
  const metaData = resumeDetails.metaData || {};

  // FORCE ENABLE ALL WIDGETS (User Request)
  const profileWidgets = {
    ...(resumeDetails.profileWidgets || {}),
    duplicateWidget: true,
    attentionWidget: true,
    editProfileWidget: true,
    favouriteWidget: true,
    resumeWidget: true,
    shortListWidget: true,
    unSubscribeWidget: true,
    referralWidget: true,
    profileSummaryWidget: true,
    profileViewedWidget: true,
    downloadProfileWidget: true,
    linkCampaignWidget: true,
    massEmailWidget: true,
    massSMSWidget: true,
    profileShareWidget: true,
    linkFolderWidget: true,
    tagsAttachWidget: true,
    skipAutomationWidget: true,
    exportProfileWidget: true,
    directVideoWidget: true,
    uploadResumesWidget: true
  };

  const mockPermissions = { canEdit: true };

  const handleEditSection = (section: string) => {
    setEditModalTab(section);
    setIsEditModalOpen(true);
  };

  // Widget Handler
  const handleWidgetAction = async (action: string) => {
    console.log("Widget Action:", action);
    switch (action) {
      case 'edit_global':
        setEditModalTab('BASIC');
        setIsEditModalOpen(true);
        break;
      case 'shortlist':
        // Cycle Logic: None -> Shortlisted -> Rejected -> None
        const nextStatus = shortlistStatus === 'none' ? 'shortlisted' :
          shortlistStatus === 'shortlisted' ? 'rejected' : 'none';
        setShortlistStatus(nextStatus);
        // Mock API Call
        try {
          // await profileService.updateShortlist(id, nextStatus);
          addToast(`Status updated to ${nextStatus}`, "success");
        } catch (e) {
          addToast("Failed to update status", "error");
        }
        break;
      case 'export':
        addToast("Opening Export Dialog... (Placeholder)", "info");
        break;
      case 'duplicate':
        addToast("Duplicate check clicked", "info");
        break;
      case 'view_resume':
        // Trigger Resume Preview Logic
        break;
      default:
        addToast(`${action} widget clicked`, "default");
    }
  };

  useEffect(() => {
    setPreviewCampaign(null);
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setIsScrolled(scrollContainerRef.current.scrollTop > 80);
      }
    };
    const container = scrollContainerRef.current;
    if (container) container.addEventListener('scroll', handleScroll);
    return () => { if (container) container.removeEventListener('scroll', handleScroll); };
  }, []);

  const handleSaveProfile = async (updatedData: any) => {
    try {
      if (!id) return;
      // Optimistic update or wait for server
      await profileService.update(id, updatedData);
      addToast("Profile updated successfully", "success");
      if (refreshProfile) refreshProfile();
      // If hooks/useCandidateProfile doesn't export refresh, we might need to reload or mutate local state. 
      // Assuming integration works for now.
    } catch (err) {
      console.error("Update failed", err);
      addToast("Failed to update profile", "error");
    }
  };

  if (loading && !liveData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Fetching Profile Details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-red-500 font-bold text-lg mb-2">Error Loading Profile</p>
          <p className="text-slate-500 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileDetails data={resumeDetails} onEditSection={handleEditSection} />;
      case 'resume': return <div className="h-[800px] bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-slate-400 dark:text-slate-500 font-medium">PDF Viewer Placeholder</div>;
      case 'activity': return <ActivitiesView />;
      case 'chat': return <TalentChatView />;
      case 'campaigns': return <CampaignsView onPreviewCampaign={setPreviewCampaign} onShowMatchScore={() => setShowMatchScore(true)} />;
      case 'folders': return <EmptyView title="No Linked Folders" message="This candidate hasn't been added to any folders yet." icon={Folder} />;
      case 'interviews': return <InterviewsView onSelectInterview={setSelectedInterview} />;
      case 'recommended': return <RecommendedView />;
      case 'duplicate': return <EmptyView title="No Duplicate Profiles" message="We didn't find any potential duplicates for this candidate in the system." icon={Copy} />;
      case 'similar': return <SimilarProfilesView />;
      default: return <ProfileDetails data={resumeDetails} />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-slate-50 dark:bg-slate-900 w-full animate-in fade-in duration-300">
      {/* MODALS */}
      {showMatchScore && <LocalMatchAnalysisModal onClose={() => setShowMatchScore(false)} />}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={liveData}
        onSave={handleSaveProfile}
        initialTab={editModalTab}
      />
      <ExportProfileModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        candidateName={candidateName}
      />

      {maximizedTemplate && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <InterviewFormContent
              template={maximizedTemplate.template}
              roundName={maximizedTemplate.roundName}
              onClose={() => setMaximizedTemplate(null)}
              onMaximize={() => setMaximizedTemplate(null)}
              isMaximized={true}
              readOnly={maximizedTemplate.readOnly}
            />
          </div>
        </div>
      )}

      {selectedInterview && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
            {selectedInterview.templateAttached ? (
              <InterviewFormContent
                template={{ title: selectedInterview.name }}
                roundName={selectedInterview.type}
                onClose={() => setSelectedInterview(null)}
                readOnly={selectedInterview.status === 'Completed'}
              />
            ) : (
              <div className="flex flex-col h-full">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">{selectedInterview.name}</h3>
                  <button onClick={() => setSelectedInterview(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><ChevronLeft size={20} /></button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
                  <FileEdit size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 mb-4">No Template Attached</p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-colors">Attach Template</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <header className={`bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0 sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'py-2 px-4 md:px-6 shadow-sm' : 'py-4 md:py-6 px-4 md:px-8'}`}>
        <div className="h-full">
          <div className={`transition-opacity duration-200 ${isScrolled ? 'hidden opacity-0' : 'block opacity-100'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex gap-4 w-full md:w-auto">
                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-2xl uppercase shrink-0">
                  {candidateName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">{candidateName}</h1>


                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{candidateRole}</p>
                  <div className="flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-green-500 dark:text-green-400" /><span>{candidateLocation}</span><CheckCircle size={14} className="text-green-500 dark:text-green-400" /></div>
                    <div className="flex items-center gap-2 flex-wrap"><TagIcon size={14} className="text-slate-400" />
                      {displayTags.length > 0 ? (
                        displayTags.map((tag: any, i: number) => (<span key={i} className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-0.5 rounded text-xs">{tag}</span>))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No Tags</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-4 md:gap-6 w-full md:w-auto">
                <div className="flex justify-end w-full">
                  {/* NEW WIDGET SYSTEM */}
                  <HeroWidgets
                    widgets={profileWidgets}
                    metaData={metaData}
                    permissions={mockPermissions}
                    onAction={handleWidgetAction}
                    shortlistStatus={shortlistStatus}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right text-sm w-full md:w-auto">
                  <div><span className="text-slate-800 dark:text-slate-200 font-bold block">Personnel Status</span><span className="text-slate-500 dark:text-slate-400">{candidateStatus}</span></div>
                  <div><span className="text-slate-800 dark:text-slate-200 font-bold block">Availability</span><span className="text-slate-500 dark:text-slate-400">{candidateAvailability}</span></div>
                  <div><span className="text-slate-800 dark:text-slate-200 font-bold block">Employment Status</span><span className="text-slate-500 dark:text-slate-400">{candidateType}</span></div>
                  <div><span className="text-slate-800 dark:text-slate-200 font-bold block">Channel</span><span className="text-slate-500 dark:text-slate-400">{metaData.inputChannel || "Manual"}</span></div>
                </div>
              </div>
            </div>
          </div>
          {/* ... (Scrolled header logic remains same) ... */}
        </div>
      </header>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="h-full">
          {previewCampaign ? (
            <div className="min-h-full">
              <CampaignDetailView
                campaign={previewCampaign}
                onBack={() => setPreviewCampaign(null)}
                onMaximizeTemplate={setMaximizedTemplate}
                onShowMatchScore={() => setShowMatchScore(true)}
                isScrolled={isScrolled}
              />
            </div>
          ) : (
            <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24">{renderContent()}</div>
          )}
        </div>
      </div>
    </div>
  );
};
