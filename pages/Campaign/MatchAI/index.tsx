
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    ChevronLeft, Search, Filter, MapPin, Mail, Phone, Linkedin, Briefcase
} from '../../../components/Icons';
import { useScreenSize } from '../../../hooks/useScreenSize';
import { MatchScore } from './MatchScore';
import { MatchSummary } from './MatchSummary';
import { AdditionalJobRequirement } from './AdditionalJobRequirement';
import { ProfileDrawer } from '../../../components/ProfileDrawer';
import { interviewService } from '../../../services/interviewService';
import { stripHtml, getSkillCategory, formatMatchScore, SkillMatchCategory } from '../../../utils/mongoUtils';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { ResumePreviewModal } from '../../../components/ResumePreviewModal';

// MATCH_CANDIDATES logic will be handled by state

const ScoreRing = ({ score, size = 60, stroke = 4, fontSize = "text-sm" }: any) => {
    const radius = (size - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 10) * circumference;

    let color = "text-red-500";
    if (score >= 8) color = "text-emerald-500";
    else if (score >= 6) color = "text-yellow-500";

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 w-full h-full">
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={stroke} fill="transparent" className="text-slate-100 dark:text-slate-700" />
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={stroke} fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} className={`transition-all duration-1000 ease-out ${color}`} strokeLinecap="round" />
            </svg>
            <span className={`absolute font-bold ${color} ${fontSize}`}>{score}</span>
        </div>
    );
};

const CandidateListCard = ({ candidate, isSelected, onClick }: any) => (
    <div
        onClick={onClick}
        className={`p-4 border-b border-slate-100 dark:border-slate-700 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800 group ${isSelected ? 'bg-indigo-50/60 dark:bg-indigo-900/20 border-l-4 border-l-indigo-600 dark:border-l-indigo-400' : 'border-l-4 border-l-transparent'}`}
    >
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${isSelected ? 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                    {candidate.avatar}
                </div>
                <div>
                    <h4 className={`font-bold text-sm ${isSelected ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>{candidate.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate w-32">{candidate.role}</p>
                </div>
            </div>
            <ScoreRing score={candidate.score} size={40} stroke={3} fontSize="text-[10px]" />
        </div>
        <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${candidate.status === 'New' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}`}>
                {candidate.status}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin size={10} /> {candidate.location}
            </span>
        </div>
    </div>
);

export const MatchAI = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
    const [isMobileListOpen, setIsMobileListOpen] = useState(true);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { isDesktop } = useScreenSize();
    const { userProfile } = useUserProfile();

    // Helper for initials
    const getInitials = (name: string) => {
        if (!name) return 'C';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await interviewService.getAll({ campaignID: id });

                // Map MongoDB data to UI format
                const mapped = data
                    .filter((iv: any) => iv.linked === true)
                    .map((iv: any) => {
                        const allSkills = iv.MRI?.experience?.skills || iv.experience?.skills || [];
                        const candidateName = iv.profile?.fullName || 'Unknown Candidate';

                        // Helper to find current/most recent job title
                        const getRecentJobTitle = () => {
                            // 1. Check for Resume Experience (Priority)
                            const resumeExp = iv.resume?.professionalExperience || iv.profile?.professionalExperience || [];
                            if (Array.isArray(resumeExp) && resumeExp.length > 0) {
                                // Try to find current role
                                const current = resumeExp.find((e: any) => !e.endDate || e.endDate.text?.toLowerCase() === 'present' || e.currentStatus === 'Working');
                                if (current && (current.jobTitle?.text || current.jobTitle)) return current.jobTitle.text || current.jobTitle;
                                // Fallback to first item
                                if (resumeExp[0]?.jobTitle?.text || resumeExp[0]?.jobTitle) return resumeExp[0].jobTitle.text || resumeExp[0].jobTitle;
                            }

                            // 2. Check for Candidate Experience (Legacy/Alternative path)
                            const exp = iv.profile?.experience || iv.MRI?.experience || [];
                            if (Array.isArray(exp) && exp.length > 0) {
                                const current = exp.find((e: any) => e.isCurrent || !e.endDate);
                                if (current && current.jobTitle) return current.jobTitle.title || current.jobTitle;
                                if (exp[0].jobTitle) return exp[0].jobTitle.title || exp[0].jobTitle;
                            }

                            // 3. Fallback to professional summary or campaign title
                            return iv.resume?.professionalSummary?.currentRole?.jobTitle || iv.profile?.professionalSummary?.currentRole?.title || iv.campaign?.title || 'No Role Specified';
                        };

                        const groupedSkills = {
                            matched: {
                                required: allSkills.filter((s: any) => s.eligibilityCheck === 'Required' && getSkillCategory(s) !== SkillMatchCategory.NOT_MENTIONED)
                                    .map((s: any) => ({ text: stripHtml(s.jobSkill), category: getSkillCategory(s) })),
                                preferred: allSkills.filter((s: any) => s.eligibilityCheck === 'Preferred' && getSkillCategory(s) !== SkillMatchCategory.NOT_MENTIONED)
                                    .map((s: any) => ({ text: stripHtml(s.jobSkill), category: getSkillCategory(s) }))
                            },
                            missing: {
                                required: allSkills.filter((s: any) => s.eligibilityCheck === 'Required' && getSkillCategory(s) === SkillMatchCategory.NOT_MENTIONED)
                                    .map((s: any) => stripHtml(s.jobSkill)),
                                preferred: allSkills.filter((s: any) => s.eligibilityCheck === 'Preferred' && getSkillCategory(s) === SkillMatchCategory.NOT_MENTIONED)
                                    .map((s: any) => stripHtml(s.jobSkill))
                            }
                        };

                        return {
                            id: iv._id,
                            resumeID: iv.resumeID, // Store for profile linking
                            name: candidateName,
                            role: getRecentJobTitle(),
                            location: iv.resume?.profile?.locations?.[0]?.text || iv.profile?.locations?.[0]?.text || iv.profile?.contact?.currentLocation?.text || 'No Location',
                            score: formatMatchScore(iv.MRI?.actual_mri_score || 0),
                            avatar: getInitials(candidateName),
                            status: iv.feedBack?.status || iv.status || 'New',
                            email: iv.profile?.emails?.[0]?.text || 'N/A',
                            phone: iv.profile?.phones?.[0]?.text || 'N/A',
                            breakdown: {
                                skills: formatMatchScore(iv.MRI?.experience?.matchScore || 0),
                                experience: formatMatchScore(iv.MRI?.experience?.matchScore || 0),
                                education: formatMatchScore(iv.MRI?.education?.matchScore || 0)
                            },
                            skills: groupedSkills,
                            aiSummary: iv.MRI?.genAI?.[0]?.matchSummary || iv.MRI?.experience?.matchSummary || 'No summary available.'
                        };
                    })
                    // SORT BY SCORE DESCENDING
                    .sort((a: any, b: any) => parseFloat(b.score) - parseFloat(a.score));

                setCandidates(mapped);
                if (mapped.length > 0) {
                    // Preserve selection if possible, else default to first
                    setSelectedCandidateId(prev => prev && mapped.find(c => c.id === prev) ? prev : mapped[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch candidates:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

    // --- ACTIONS ---
    const updateCandidateStatus = async (status: string, additionalData: any = {}) => {
        if (!selectedCandidateId || !userProfile?.id) return;

        try {
            // Optimistic Update
            setCandidates(prev => prev.map(c =>
                c.id === selectedCandidateId ? { ...c, status } : c
            ));

            const payload = {
                feedBack: {
                    status,
                    ...additionalData
                },
                status // Top level status as well often used
            };

            await interviewService.update(selectedCandidateId, payload);
            // Optionally show toast success here
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert on failure if needed
        }
    };

    const handleShortlist = () => {
        updateCandidateStatus('Shortlisted', {
            shortlistedAt: new Date(),
            shortlistedBy: userProfile.id
        });
    };

    const handleReject = () => {
        updateCandidateStatus('Rejected', {
            rejectedAt: new Date(),
            rejectedBy: userProfile.id
        });
    };

    const handleSelectCandidate = (id: string) => {
        setSelectedCandidateId(id);
        if (!isDesktop) setIsMobileListOpen(false);
    };

    // --- RESUME PREVIEW ---
    const [previewResumeId, setPreviewResumeId] = useState<string | null>(null);

    // --- HERO WIDGETS LOGIC ---
    const [shortlistStatus, setShortlistStatus] = useState<'shortlisted' | 'rejected' | 'none'>('none');

    // Sync local shortlist status with selected candidate
    useEffect(() => {
        if (selectedCandidate) {
            const status = selectedCandidate.status?.toLowerCase();
            setShortlistStatus(status === 'shortlisted' ? 'shortlisted' : status === 'rejected' ? 'rejected' : 'none');
        }
    }, [selectedCandidate]);


    const handleWidgetAction = (action: string, data?: any) => {
        console.log("MatchAI Widget Action:", action);
        switch (action) {
            case 'shortlist_accept':
                handleShortlist();
                break;
            case 'shortlist_reject':
                handleReject();
                break;
            case 'view_profile':
                setSearchParams(prev => {
                    const newParams = new URLSearchParams(prev);
                    if (selectedCandidate?.resumeID) newParams.set('rid', selectedCandidate.resumeID);
                    return newParams;
                });
                break;
            case 'view_resume':
                if (selectedCandidate?.resumeID) handlePreview(selectedCandidate.resumeID);
                break;
            case 'email':
                // Placeholder
                alert("Email action triggered");
                break;
            case 'sms':
                // Placeholder
                alert("SMS action triggered");
                break;
            case 'edit_global':
                // Placeholder or open edit modal if available
                alert("Edit Profile triggered");
                break;
            default:
                console.log("Unhandled widget action:", action);
        }
    };

    // Construct Widgets Config (Force enable for MatchAI context)
    const matchWidgets = {
        resumeWidget: true,
        shortListWidget: true,
        massEmailWidget: true,
        massSMSWidget: true,
        editProfileWidget: true,
        duplicateWidget: true,
        attentionWidget: true,
        favouriteWidget: true,
        unSubscribeWidget: true,
        referralWidget: true,
        profileSummaryWidget: true,
        profileViewedWidget: true,
        downloadProfileWidget: true,
        linkCampaignWidget: true,
        profileShareWidget: true,
        linkFolderWidget: true,
        tagsAttachWidget: true,
        skipAutomationWidget: true,
        exportProfileWidget: true,
        directVideoWidget: true,
        uploadResumesWidget: true
    };

    const matchMetaData = {
        // Add any metadata if needed by widgets
    };

    const matchPermissions = { canEdit: true };

    const handlePreview = (rid: string) => {
        setPreviewResumeId(rid);
    };

    return (
        <div className="flex h-full w-full bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
            <ResumePreviewModal
                isOpen={!!previewResumeId}
                resumeID={previewResumeId}
                onClose={() => setPreviewResumeId(null)}
            />
            {/* Sidebar List */}
            <div className={`w-full lg:w-80 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] absolute lg:relative inset-0 lg:inset-auto transition-transform duration-300 ${isMobileListOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* ... Sidebar Content ... */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Ranked Candidates</h3>
                        <button className="lg:hidden text-slate-400" onClick={() => setIsMobileListOpen(false)}><ChevronLeft /></button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Filter list..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-200 dark:placeholder-slate-500"
                        />
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>Sort by: <b>Match Score</b></span>
                        <button className="hover:text-indigo-600 dark:hover:text-indigo-400"><Filter size={14} /></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400 text-sm">Loading candidates...</div>
                    ) : filteredCandidates.length > 0 ? (
                        filteredCandidates.map(candidate => (
                            <CandidateListCard
                                key={candidate.id}
                                candidate={candidate}
                                isSelected={selectedCandidateId === candidate.id && isDesktop}
                                onClick={() => handleSelectCandidate(candidate.id)}
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-400 text-sm">No candidates found add candidates to this campaign</div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col h-full overflow-hidden ${!isMobileListOpen ? 'w-full' : 'hidden lg:flex'}`}>
                <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 lg:p-6 transition-colors custom-scrollbar">
                    <div className="max-w-5xl mx-auto space-y-6">

                        <button onClick={() => setIsMobileListOpen(true)} className="lg:hidden flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                            <ChevronLeft size={16} /> Back to List
                        </button>

                        {selectedCandidate ? (
                            <>
                                <MatchScore
                                    candidate={selectedCandidate}
                                    widgets={matchWidgets}
                                    metaData={matchMetaData}
                                    permissions={matchPermissions}
                                    onAction={handleWidgetAction}
                                    shortlistStatus={shortlistStatus}
                                />

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 space-y-6">
                                        <MatchSummary candidate={selectedCandidate} />
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 transition-colors">
                                            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Contact Info</h4>
                                            <div className="space-y-3">
                                                <a href={`mailto:${selectedCandidate.email}`} className="flex items-center gap-3 text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                                                    <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-400"><Mail size={16} /></div>
                                                    <span className="truncate">{selectedCandidate.email}</span>
                                                </a>
                                                <a href={`tel:${selectedCandidate.phone}`} className="flex items-center gap-3 text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                                                    <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-400"><Phone size={16} /></div>
                                                    <span>{selectedCandidate.phone}</span>
                                                </a>
                                                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                                                    <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-400"><Linkedin size={16} /></div>
                                                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">linkedin.com/in/user</span>
                                                </div>
                                            </div>
                                        </div>

                                        <AdditionalJobRequirement candidateName={selectedCandidate.name} />

                                        {/* Removed Quick Actions Box as requested */}
                                    </div>
                                </div>
                            </>
                        ) : !loading && (
                            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                <Search size={48} className="mx-auto text-slate-200 mb-4" />
                                <h3 className="text-xl font-bold text-slate-400">No Candidate Selected</h3>
                                <p className="text-slate-500 mt-1">Select a candidate from the list to view their match details.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ProfileDrawer candidateIds={candidates.map(c => c.resumeID)} />
        </div>
    );
};
