
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
                            name: iv.profile?.fullName || 'Unknown Candidate',
                            role: iv.MRI?.experience?.jobTitle?.jobTitle || iv.profile?.MRI?.experience?.jobTitle?.jobTitle || iv.campaign?.title || 'No Role Specified',
                            location: iv.profile?.locations?.[0]?.text || 'No Location',
                            score: formatMatchScore(iv.MRI?.actual_mri_score || 0),
                            avatar: (iv.profile?.firstName?.[0] || '') + (iv.profile?.lastName?.[0] || 'C'),
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
                    });

                setCandidates(mapped);
                if (mapped.length > 0) {
                    setSelectedCandidateId(mapped[0].id);
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

    const handleSelectCandidate = (id: string) => {
        setSelectedCandidateId(id);
        if (!isDesktop) setIsMobileListOpen(false);
    };

    const handlePreview = (rid: string) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('rid', rid);
            if (!newParams.get('tab')) newParams.set('tab', 'profile');
            return newParams;
        });
    };

    return (
        <div className="flex h-full bg-white dark:bg-slate-900 relative overflow-hidden transition-colors">
            {/* Sidebar List */}
            <div className={`w-full lg:w-80 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] absolute lg:relative inset-0 lg:inset-auto transition-transform duration-300 ${isMobileListOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
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
                                <MatchScore candidate={selectedCandidate} onPreview={() => handlePreview(selectedCandidate.resumeID)} />

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 space-y-6">
                                        <MatchSummary candidate={selectedCandidate} />
                                        <AdditionalJobRequirement candidateName={selectedCandidate.name} />
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 transition-colors">
                                            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Contact Info</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                                                    <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-400"><Mail size={16} /></div>
                                                    <span className="truncate">{selectedCandidate.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                                                    <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-400"><Phone size={16} /></div>
                                                    <span>{selectedCandidate.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                                                    <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-400"><Linkedin size={16} /></div>
                                                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">linkedin.com/in/user</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 transition-colors">
                                            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h4>
                                            <div className="space-y-3">
                                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 transition-all">
                                                    <Briefcase size={16} /> View Full Resume
                                                </button>
                                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 rounded-lg text-sm font-medium text-indigo-700 dark:text-indigo-300 transition-all">
                                                    <Linkedin size={16} /> LinkedIn Profile
                                                </button>
                                            </div>
                                        </div>
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
