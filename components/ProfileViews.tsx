
import React, { useState } from 'react';
import { 
  Briefcase, MapPin, CheckCircle, Clock, 
  MessageCircle, Paperclip, Send, AlertCircle, ExternalLink, ThumbsUp,
  User, Phone, Mail, Globe, Award, Calendar, Shield, Lock, Star, X
} from 'lucide-react';
import { SectionCard, SecureContactCard } from './Common';
import { CANDIDATE } from '../data';

// Updated Profile Details Component to handle dynamic JSON schema with the OLD UI Layout
export const ProfileDetails = ({ data }: { data?: any }) => {
  const [showAllSkills, setShowAllSkills] = useState(false);

  // Safe extraction of nested data
  const resume = data?.resumeDetails?.resume || {};
  const profile = resume.profile || {};
  const summary = resume.professionalSummary || {};
  const experience = resume.professionalExperience || [];
  const education = resume.professionalQualification?.education || [];
  const skills = resume.professionalQualification?.skills || [];
  
  // Format helpers
  const formatSalary = (salary: any) => {
      if (!salary) return 'N/A';
      if (salary.text) return salary.text;
      if (salary.value) return `${salary.currency || '$'} ${salary.value} ${salary.period || ''}`;
      return 'N/A';
  };

  const toSentenceCase = (str: string) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
       {/* LEFT COLUMN - MAIN CONTENT */}
       <div className="lg:col-span-2 space-y-6">
          
          {/* Professional Summary */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Professional Summary</h3>
             <p className="text-sm leading-relaxed text-slate-600">
                {summary.summary || "No summary provided."}
             </p>
          </div>

          {/* Work Experience - Timeline UI */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Work Experience</h3>
             
             <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-2">
                {experience.map((exp: any, idx: number) => (
                   <div key={idx} className="relative pl-8">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${exp.currentStatus === 'Working' || idx === 0 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                         <div>
                            <h4 className="font-bold text-slate-800 text-base">{exp.jobTitle?.text || 'N/A'}</h4>
                            <div className="text-sm font-semibold text-green-600 flex items-center gap-2 mt-0.5">
                               {exp.company?.text || 'Unknown Company'}
                               {exp.location?.text && <span className="text-slate-400 font-normal text-xs">• {exp.location.text}</span>}
                            </div>
                         </div>
                         <div className="mt-1 sm:mt-0 text-right">
                            <div className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded inline-block font-medium">
                               {exp.startDate?.text || 'N/A'} - {exp.endDate?.text || 'Present'}
                            </div>
                            {exp.duration?.text && <div className="text-[10px] text-slate-400 mt-1">{exp.duration.text}</div>}
                         </div>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed mb-3 whitespace-pre-line">
                         {exp.description || "No description provided."}
                      </p>

                      {/* Skills used in this role */}
                      {exp.skills && exp.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                              {exp.skills.slice(0, 5).map((skill: any, sIdx: number) => (
                                  <span key={sIdx} className="text-[10px] px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full text-slate-500">
                                      {toSentenceCase(skill.text)}
                                  </span>
                              ))}
                              {exp.skills.length > 5 && <span className="text-[10px] px-2 py-0.5 text-slate-400">+{exp.skills.length - 5} more</span>}
                          </div>
                      )}
                   </div>
                ))}
                {experience.length === 0 && <div className="pl-8 text-slate-400 italic">No experience listed.</div>}
             </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Education</h3>
             <div className="space-y-4">
                {education.map((edu: any, idx: number) => (
                   <div key={idx} className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                         <Award size={20} />
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-800 text-sm">{edu.degree?.text || 'Degree'}</h4>
                         <p className="text-xs text-slate-500 uppercase font-bold mt-0.5">{edu.university?.text || edu.campus?.text || 'University'}</p>
                         <p className="text-xs text-slate-400 mt-1">{edu.endDate?.year || 'Year N/A'}</p>
                      </div>
                   </div>
                ))}
                {education.length === 0 && <div className="text-slate-400 italic">No education listed.</div>}
             </div>
          </div>

       </div>

       {/* RIGHT COLUMN - SIDEBAR */}
       <div className="space-y-6">
          
          {/* Secure Contact */}
          <SecureContactCard contact={{ 
              email: profile.emails?.[0]?.text || 'N/A', 
              phone: profile.phones?.[0]?.text || 'N/A' 
          }} />

          {/* Skills & Competencies */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Skills & Competencies</h3>
             <div className="flex flex-wrap gap-2">
                {skills.slice(0, 15).map((skill: any, idx: number) => (
                   <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-default">
                      {toSentenceCase(skill.text)}
                      {skill.yearsOfExperience ? <span className="ml-1 text-slate-400">({skill.yearsOfExperience}y)</span> : ''}
                   </span>
                ))}
                {skills.length > 15 && (
                    <button 
                        onClick={() => setShowAllSkills(true)}
                        className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                        +{skills.length - 15} more
                    </button>
                )}
                {skills.length === 0 && <span className="text-slate-400 text-xs">No skills extracted.</span>}
             </div>
          </div>

          {/* Key Details */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Key Details</h3>
             <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                   <span className="text-sm text-slate-600">Willing to Relocate</span>
                   <span className="text-sm font-bold text-slate-800">{summary.preferredLocations && summary.preferredLocations.length > 0 ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                   <span className="text-sm text-slate-600">Work Authorization</span>
                   <span className="text-sm font-bold text-slate-800">{summary.workPermit?.text || 'Unknown'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                   <span className="text-sm text-slate-600">Notice Period</span>
                   <span className="text-sm font-bold text-slate-800">{summary.noticePeriod?.text || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                   <span className="text-sm text-slate-600">Current Salary</span>
                   <span className="text-sm font-bold text-slate-800">{formatSalary(summary.currentSalary)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                   <span className="text-sm text-slate-600">Expected Salary</span>
                   <span className="text-sm font-bold text-slate-800">{formatSalary(summary.expectedSalary)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                   <span className="text-sm text-slate-600">Experience</span>
                   <span className="text-sm font-bold text-slate-800">{summary.yearsOfExperience?.finalYears || 0} Years</span>
                </div>
             </div>
          </div>

          {/* AI Summary Widget */}
          {data?.resumeDetails?.genAISummary && (
             <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg border border-indigo-100 shadow-sm p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Briefcase size={64} className="text-indigo-600" />
                </div>
                <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertCircle size={14} /> AI Profile Summary
                </h3>
                <p className="text-xs leading-relaxed text-indigo-900/80">
                    {data.resumeDetails.genAISummary.profileSummary || "AI is analyzing this profile to provide insights on fit and potential."}
                </p>
             </div>
          )}

       </div>
    </div>

    {/* All Skills Modal */}
    {showAllSkills && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[80vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">All Skills ({skills.length})</h2>
                    <button onClick={() => setShowAllSkills(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill: any, idx: number) => (
                            <span key={idx} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 transition-colors">
                                {toSentenceCase(skill.text)}
                                {skill.yearsOfExperience ? <span className="ml-1.5 text-slate-400 text-xs font-normal">({skill.yearsOfExperience} Years)</span> : ''}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )}
    </>
  );
};

export const ActivitiesView = () => (
  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
     <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Activity Log</h3>
        <button className="text-sm text-green-600 font-medium hover:underline">Download Report</button>
     </div>
     
     <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-8">
        {CANDIDATE.activities?.map((act: any) => {
           const Icon = act.icon;
           return (
              <div key={act.id} className="relative pl-8">
                 <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${act.id === 1 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                 
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 sm:mb-0">{act.dateGroup}</span>
                    <span className="text-xs text-slate-400 font-mono">{act.time}</span>
                 </div>

                 <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                       <div className={`p-2 rounded-lg ${act.color} shrink-0`}>
                          <Icon size={18} />
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-800 text-sm mb-0.5">{act.title}</h4>
                          <p className="text-xs text-slate-500">Action by <span className="font-medium text-slate-700">{act.author}</span></p>
                       </div>
                    </div>
                 </div>
              </div>
           );
        })}
     </div>
  </div>
);

export const TalentChatView = () => (
   <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
         <div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><MessageCircle size={18} className="text-emerald-600" /> Talent Chat</h3>
            <p className="text-xs text-slate-500">Secure conversation with {CANDIDATE.name}</p>
         </div>
         <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">Online</span>
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30 space-y-6">
         <div className="flex justify-center"><span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Today, 9:41 AM</span></div>
         <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs">R</div>
            <div><div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 max-w-md">Hi Testy, thanks for applying. Are you available for a quick call tomorrow?</div><span className="text-[10px] text-slate-400 ml-1 mt-1 block">Recruiter • 9:42 AM</span></div>
         </div>
         <div className="flex gap-3 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">TM</div>
            <div><div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm max-w-md">Hello! Yes, I am available anytime after 2 PM EST. Looking forward to it.</div><span className="text-[10px] text-slate-400 text-right mr-1 mt-1 block">Read • 9:45 AM</span></div>
         </div>
      </div>
      <div className="p-4 bg-white border-t border-slate-200">
         <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"><Paperclip size={20} /></button>
            <input type="text" placeholder="Type a message..." className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
            <button className="p-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-full shadow-sm transition-colors"><Send size={18} /></button>
         </div>
      </div>
   </div>
);

export const RecommendedView = () => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div>
            <h3 className="font-bold text-slate-800">Recommended Jobs</h3>
            <p className="text-sm text-slate-500 mt-0.5">AI-suggested requisitions based on candidate skills.</p>
        </div>
        <button className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors">
            Run Matching Engine
        </button>
    </div>
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
        <thead className="bg-white text-slate-500 font-semibold border-b border-slate-200">
            <tr>
            <th className="px-6 py-4 uppercase text-xs tracking-wider">Campaign Name</th>
            <th className="px-6 py-4 uppercase text-xs tracking-wider">Job ID</th>
            <th className="px-6 py-4 uppercase text-xs tracking-wider">Location</th>
            <th className="px-6 py-4 uppercase text-xs tracking-wider">Company</th>
            <th className="px-6 py-4 w-24"></th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
            {CANDIDATE.recommended?.map((rec: any) => (
            <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4 font-bold text-emerald-700 group-hover:underline cursor-pointer">{rec.name}</td>
                <td className="px-6 py-4 text-slate-600 font-mono text-xs bg-slate-50/0 group-hover:bg-white w-fit rounded px-2">{rec.jobID}</td>
                <td className="px-6 py-4 text-slate-600"><div className="flex items-center gap-2"><MapPin size={14} className="text-slate-400"/> {rec.location}</div></td>
                <td className="px-6 py-4 text-slate-600">{rec.company}</td>
                <td className="px-6 py-4 text-right">
                <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm">Select</button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
  </div>
);

export const SimilarProfilesView = () => (
  <div className="space-y-4 max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-4 mb-6">
        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <AlertCircle size={24} />
        </div>
        <div>
            <h4 className="font-bold text-blue-900 text-sm">Similar Candidates Found</h4>
            <p className="text-sm text-blue-700 mt-1 leading-relaxed">These candidates share similar skills, experience, or location data with the current profile.</p>
        </div>
    </div>
    <div className="grid grid-cols-1 gap-4">
        {CANDIDATE.similar?.map((profile: any) => (
        <div key={profile.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col sm:flex-row items-center justify-between group">
            <div className="flex items-center gap-5 w-full sm:w-auto">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    {profile.name.substring(0,2).toUpperCase()}
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors text-base cursor-pointer">{profile.name}</h4>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400"/> {profile.location}</span>
                        <span className="hidden sm:inline text-slate-300">|</span>
                        <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-slate-400"/> {profile.role}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Match Score</span>
                    <div className="flex items-center gap-1 justify-end">
                         <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${profile.score}%`}}></div>
                         </div>
                         <span className="font-bold text-slate-800 text-lg">{profile.score}%</span>
                    </div>
                </div>
                <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100">
                    <ExternalLink size={20} />
                </button>
            </div>
        </div>
        ))}
    </div>
  </div>
);
