
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Briefcase, BarChart2, 
  Settings, LogOut, UserPlus, Building2, CheckCircle, 
  User, Phone, UserCog, Lock, Menu, X, ChevronLeft,
  FileText, Activity, MessageSquare, FolderOpen, ThumbsUp, Copy, MessageCircle
} from 'lucide-react';
import { ToastProvider } from './components/Toast';
import { Home } from './pages/Home';
import { Profiles } from './pages/Profiles';
import { Campaigns } from './pages/Campaigns';
import { Metrics } from './pages/Metrics';
import { CandidateProfile } from './pages/CandidateProfile';
import { CampaignDashboard } from './pages/CampaignDashboard';
import { Campaign } from './types';
import { CreateProfileModal } from './components/CreateProfileModal';
import { CANDIDATE } from './data';

// --- SIDEBAR COMPONENTS ---

const SidebarFooter = ({ setIsCreateProfileOpen }: { setIsCreateProfileOpen: (v: boolean) => void }) => (
    <div className="p-4 border-t border-slate-200 bg-white mt-auto space-y-2 shrink-0">
        {/* Create Profile */}
        <button 
          onClick={() => setIsCreateProfileOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-md transition-colors group"
        >
            <UserPlus size={18} className="text-slate-400 group-hover:text-emerald-600" />
            <span className="text-sm font-medium">Create Profile</span>
        </button>
  
        {/* Switch Client */}
        <div className="relative group/client">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-md transition-colors group">
              <Building2 size={18} className="text-slate-400 group-hover:text-emerald-600" />
              <span className="text-sm font-medium truncate">TRC Talent Solutions</span>
          </button>
        </div>
  
        {/* User Account */}
        <div className="pt-2 border-t border-slate-100 mt-2">
           <button className="w-full flex items-center gap-3 px-2 py-2 text-slate-600 hover:bg-slate-50 rounded-md transition-colors">
               <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shrink-0">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" className="w-full h-full object-cover" />
               </div>
               <div className="text-left flex-1 min-w-0">
                   <p className="text-sm font-bold text-slate-700 truncate">Pratik</p>
                   <p className="text-xs text-slate-400 truncate">My Account</p>
               </div>
           </button>
        </div>
    </div>
);

const MainSidebarContent = ({ activeView, setActiveView }: { activeView: string, setActiveView: (v: any) => void }) => {
  const NavItem = ({ view, icon: Icon, label }: { view: string, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-full mr-2 transition-all duration-200 ${
        activeView === view 
          ? 'bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
      }`}
    >
      <Icon size={20} className={activeView === view ? 'text-emerald-600' : 'text-slate-400'} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex-1 py-6 space-y-1">
       <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Home" />
       <NavItem view="CAMPAIGNS" icon={Briefcase} label="Campaigns" />
       <NavItem view="PROFILES" icon={Users} label="Profiles" />
       <NavItem view="METRICS" icon={BarChart2} label="Metrics" />
    </div>
  );
};

const CandidateSidebarContent = ({ activeTab, setActiveTab, onBack }: { activeTab: string, setActiveTab: (t: string) => void, onBack: () => void }) => {
  const NavItem = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
        activeTab === id 
          ? 'text-emerald-700 font-bold bg-emerald-50 border-r-4 border-emerald-600' 
          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-r-4 border-transparent'
      }`}
    >
      <Icon size={18} className={activeTab === id ? 'text-emerald-600' : 'text-slate-400'} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex-1 overflow-y-auto">
       <div className="p-4 pb-2">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs font-medium mb-4 transition-colors"
          >
             <ChevronLeft size={14} /> Back to Search
          </button>
          
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                {CANDIDATE.name.charAt(0)}M
             </div>
             <div className="min-w-0">
                <h3 className="font-bold text-slate-800 text-sm truncate">{CANDIDATE.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                   <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{CANDIDATE.availability}</span>
                </div>
             </div>
          </div>
       </div>

       <div className="space-y-6 pb-6">
          <div>
             <h4 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">General</h4>
             <NavItem id="profile" label="Profile Details" icon={Users} />
             <NavItem id="resume" label="Resume" icon={FileText} />
             <NavItem id="activity" label="Activity" icon={Activity} />
             <NavItem id="chat" label="Talent Chat" icon={MessageCircle} />
          </div>

          <div>
             <h4 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Matching</h4>
             <NavItem id="campaigns" label="Linked Campaigns" icon={Briefcase} />
             <NavItem id="folders" label="Linked Folders" icon={FolderOpen} />
             <NavItem id="interviews" label="Interviews" icon={MessageSquare} />
             <NavItem id="recommended" label="Recommended" icon={ThumbsUp} />
          </div>

          <div>
             <h4 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">System</h4>
             <NavItem id="duplicate" label="Duplicate Profile" icon={Copy} />
             <NavItem id="similar" label="Similar Profiles" icon={Users} />
          </div>
       </div>
    </div>
  );
};

type ViewState = 'DASHBOARD' | 'PROFILES' | 'CAMPAIGNS' | 'METRICS';

const App = () => {
  const [activeView, setActiveView] = useState<ViewState>('DASHBOARD');
  
  // Navigation State
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState('profile');
  
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [activeCampaignTab, setActiveCampaignTab] = useState<string>('Intelligence');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);

  // Sub-navigation handlers
  const handleNavigateToProfile = () => {
    setSelectedCandidateId('1');
    setActiveProfileTab('profile');
    // Ensure we are in PROFILES view context
    setActiveView('PROFILES');
  };
  
  const handleBackToProfiles = () => setSelectedCandidateId(null);
  
  const handleNavigateToCampaign = (campaign: Campaign, tab: string = 'Intelligence') => {
    setSelectedCampaign(campaign);
    setActiveCampaignTab(tab);
  };
  const handleBackToCampaigns = () => setSelectedCampaign(null);

  // Handle Main Nav Switching
  const handleMainViewChange = (view: ViewState) => {
      setActiveView(view);
      setSelectedCandidateId(null);
      setSelectedCampaign(null);
  };

  return (
    <ToastProvider>
      <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)} className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md lg:hidden">
            <Menu size={20} />
          </button>
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-0 lg:hidden'} flex flex-col shadow-lg`}>
           {/* Logo Section */}
           <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3 shadow-sm">M</div>
              <span className="font-bold text-lg text-slate-800 tracking-tight">Maprecruit.ai</span>
              <button onClick={() => setIsSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400"><X size={20}/></button>
           </div>

           {/* Dynamic Content Area */}
           {selectedCandidateId ? (
              <CandidateSidebarContent 
                 activeTab={activeProfileTab} 
                 setActiveTab={setActiveProfileTab} 
                 onBack={handleBackToProfiles}
              />
           ) : (
              <MainSidebarContent 
                 activeView={activeView} 
                 setActiveView={handleMainViewChange} 
              />
           )}

           <SidebarFooter setIsCreateProfileOpen={setIsCreateProfileOpen} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative bg-slate-50">
           {activeView === 'DASHBOARD' && <Home />}
           
           {activeView === 'PROFILES' && (
             selectedCandidateId ? (
                <CandidateProfile activeTab={activeProfileTab} />
             ) : (
                <Profiles onNavigateToProfile={handleNavigateToProfile} view="SEARCH" />
             )
           )}

           {activeView === 'CAMPAIGNS' && (
             selectedCampaign ? (
                <div className="h-full flex flex-col">
                   <div className="px-4 py-2 border-b border-slate-200 bg-white flex items-center gap-2 shrink-0">
                      <button onClick={handleBackToCampaigns} className="text-sm text-slate-500 hover:text-emerald-600 flex items-center gap-1">
                         <ChevronLeft size={14} /> Back to Campaigns
                      </button>
                      <span className="text-slate-300">|</span>
                      <span className="text-sm font-medium text-slate-800">{selectedCampaign.name}</span>
                   </div>
                   <CampaignDashboard campaign={selectedCampaign} activeTab={activeCampaignTab} />
                </div>
             ) : (
                <Campaigns onNavigateToCampaign={handleNavigateToCampaign} />
             )
           )}

           {activeView === 'METRICS' && <Metrics />}
        </div>

        {/* Create Profile Modal */}
        <CreateProfileModal isOpen={isCreateProfileOpen} onClose={() => setIsCreateProfileOpen(false)} />
      </div>
    </ToastProvider>
  );
};

export default App;
