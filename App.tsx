
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Briefcase, BarChart2, 
  Settings, LogOut, UserPlus, Building2, CheckCircle, 
  User, Phone, UserCog, Lock, Menu, X, ChevronRight, Moon, Sun,
  Brain, Search, GitBranch, MessageCircle, ThumbsUp, ChevronLeft,
  FileText, Activity, Video, Copy, ClipboardList, FolderOpen
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

// Sidebar Footer Component
const SidebarFooter = ({ setIsCreateProfileOpen, darkMode, setDarkMode }: { setIsCreateProfileOpen: (v: boolean) => void, darkMode: boolean, setDarkMode: (v: boolean) => void }) => (
    <div className="p-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 mt-auto space-y-1 shrink-0 transition-colors">
        {/* Create Profile */}
        <button 
          onClick={() => setIsCreateProfileOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors group"
        >
            <UserPlus size={18} className="text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
            <span className="text-sm font-medium">Create</span>
        </button>
  
        {/* Switch Client */}
        <div className="relative group/client">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors group">
              <Building2 size={18} className="text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
              <span className="text-sm font-medium truncate">TRC Talent Solutions</span>
          </button>
          
          {/* Client List Popover */}
          <div className="absolute left-full bottom-0 ml-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl hidden group-hover/client:block p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-3 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900 rounded-t mb-1">Switch Client</div>
              <button className="w-full text-left px-3 py-2 text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 rounded flex items-center justify-between font-medium">
                 TRC Talent Solutions <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400"/>
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                 Amazon Warehouse Operations
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                 Google Staffing Services
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                 Microsoft HR Tech
              </button>
          </div>
        </div>
  
        {/* User Account */}
        <div className="relative group/account pt-2">
           <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors">
               <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600 shrink-0">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" className="w-full h-full object-cover" />
               </div>
               <div className="text-left flex-1 min-w-0">
                   <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">Pratik</p>
                   <p className="text-xs text-slate-400 dark:text-slate-500 truncate">My Account</p>
               </div>
           </button>
  
           {/* Account Popover */}
           <div className="absolute left-full bottom-0 ml-4 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl hidden group-hover/account:block z-50 animate-in fade-in zoom-in-95 duration-200">
               {/* Triangle */}
               <div className="absolute bottom-6 -left-2 w-4 h-4 bg-white dark:bg-slate-800 transform rotate-45 border-l border-b border-slate-200 dark:border-slate-700"></div>
               
               <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col items-center text-center bg-white dark:bg-slate-800 rounded-t-lg relative">
                   <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-4 border-white dark:border-slate-600 shadow-md mb-3">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" className="w-full h-full object-cover" />
                   </div>
                   <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Pratik</h4>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">pratik.gaurav@trcdemo.com</p>
                   
                   <div className="w-full border-t border-slate-100 dark:border-slate-700 pt-3 space-y-2">
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 px-2">
                          <User size={16} className="text-slate-400 dark:text-slate-500"/> 
                          <span className="font-medium">Product Admin</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 px-2">
                          <Phone size={16} className="text-slate-400 dark:text-slate-500"/> 
                          <span className="font-mono text-xs">+917004029399</span>
                      </div>
                   </div>
               </div>
               
               <div className="py-2 bg-white dark:bg-slate-800 rounded-b-lg">
                   <div className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer group/item">
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors">
                        <User size={16} /> 
                        <span className="font-medium">My Account</span>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-help">?</div>
                   </div>

                   {/* Dark Mode Toggle */}
                   <div 
                        onClick={() => setDarkMode(!darkMode)}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer group/item"
                   >
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors">
                            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                            <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        </div>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${darkMode ? 'bg-emerald-600' : 'bg-slate-300'}`}>
                            <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white dark:bg-slate-800 rounded-full transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                   </div>

                   <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                      <Settings size={16} /> Admin Settings
                   </button>
                   <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                      <UserCog size={16} /> Product Admin Settings
                   </button>
                   <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                      <Lock size={16} /> Change Password
                   </button>
                   <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                   <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
                      <LogOut size={16} /> Logout
                   </button>
               </div>
           </div>
        </div>
    </div>
);

type ViewState = 'DASHBOARD' | 'PROFILES' | 'CAMPAIGNS' | 'METRICS';

const PROFILE_TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'campaigns', label: 'Campaigns', icon: Briefcase },
  { id: 'folders', label: 'Folders', icon: FolderOpen },
  { id: 'interviews', label: 'Interviews', icon: Video },
  { id: 'recommended', label: 'Recommended', icon: ThumbsUp },
  { id: 'similar', label: 'Similar', icon: Copy },
];

const App = () => {
  const [activeView, setActiveView] = useState<ViewState>('DASHBOARD');
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  
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
  };
  const handleBackToProfiles = () => setSelectedCandidateId(null);
  
  const handleNavigateToCampaign = (campaign: Campaign, tab: string = 'Intelligence') => {
    setSelectedCampaign(campaign);
    setActiveCampaignTab(tab);
  };
  const handleBackToCampaigns = () => setSelectedCampaign(null);

  const NavItem: React.FC<{ view?: ViewState, icon: any, label: string, activeTab?: boolean, onClick?: () => void }> = ({ view, icon: Icon, label, activeTab, onClick }) => (
    <button 
      onClick={onClick ? onClick : () => { if(view) setActiveView(view); setSelectedCandidateId(null); setSelectedCampaign(null); }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
        (view && activeView === view && !selectedCampaign && !selectedCandidateId) || activeTab 
          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
      }`}
    >
      <Icon size={20} className={(view && activeView === view && !selectedCampaign && !selectedCandidateId) || activeTab ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
      <span className={!isSidebarOpen ? 'hidden' : 'block'}>{label}</span>
    </button>
  );

  return (
    <ToastProvider>
      <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors ${darkMode ? 'dark' : ''}`}>
        {/* Mobile Sidebar Overlay */}
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)} className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-md shadow-md lg:hidden border dark:border-slate-700">
            <Menu size={20} className="dark:text-slate-200" />
          </button>
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-0 lg:hidden'} flex flex-col shadow-xl`}>
           <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-900">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3 shadow-sm">M</div>
              <span className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">MapRecruit</span>
              <button onClick={() => setIsSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400"><X size={20}/></button>
           </div>

           <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {!selectedCampaign && !selectedCandidateId ? (
                <>
                  <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Dashboard" />
                  <NavItem view="CAMPAIGNS" icon={Briefcase} label="Campaigns" />
                  <NavItem view="PROFILES" icon={Users} label="Profiles" />
                  <NavItem view="METRICS" icon={BarChart2} label="Metrics" />
                </>
              ) : selectedCandidateId ? (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                  <button 
                    onClick={handleBackToProfiles}
                    className="w-full flex items-center gap-2 px-3 py-2 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <ChevronLeft size={14} /> Back to Search
                  </button>
                  
                  <div className="px-3 mb-6">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">Candidate Profile</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">ID: {selectedCandidateId}</p>
                  </div>

                  <div className="space-y-1">
                    {PROFILE_TABS.map(tab => (
                        <NavItem 
                            key={tab.id}
                            icon={tab.icon} 
                            label={tab.label} 
                            activeTab={activeProfileTab === tab.id} 
                            onClick={() => setActiveProfileTab(tab.id)} 
                        />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                  <button 
                    onClick={handleBackToCampaigns}
                    className="w-full flex items-center gap-2 px-3 py-2 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <ChevronLeft size={14} /> Back to Campaigns
                  </button>
                  
                  <div className="px-3 mb-6">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">{selectedCampaign?.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">ID: {selectedCampaign?.jobID}</p>
                  </div>

                  <div className="space-y-1">
                    <NavItem 
                      icon={Brain} 
                      label="Intelligence" 
                      activeTab={activeCampaignTab === 'Intelligence'} 
                      onClick={() => setActiveCampaignTab('Intelligence')} 
                    />
                    <NavItem 
                      icon={Search} 
                      label="Source AI" 
                      activeTab={activeCampaignTab.startsWith('Source AI')} 
                      onClick={() => setActiveCampaignTab('Source AI')} 
                    />
                    <NavItem 
                      icon={GitBranch} 
                      label="Match AI" 
                      activeTab={activeCampaignTab === 'Match AI'} 
                      onClick={() => setActiveCampaignTab('Match AI')} 
                    />
                    <NavItem 
                      icon={MessageCircle} 
                      label="Engage AI" 
                      activeTab={activeCampaignTab.startsWith('Engage AI')} 
                      onClick={() => setActiveCampaignTab('Engage AI')} 
                    />
                    <NavItem 
                      icon={ThumbsUp} 
                      label="Recommended" 
                      activeTab={activeCampaignTab === 'Recommended Profiles'} 
                      onClick={() => setActiveCampaignTab('Recommended Profiles')} 
                    />
                    <NavItem 
                      icon={Settings} 
                      label="Settings" 
                      activeTab={activeCampaignTab === 'Settings'} 
                      onClick={() => setActiveCampaignTab('Settings')} 
                    />
                  </div>
                </div>
              )}
           </div>

           <SidebarFooter setIsCreateProfileOpen={setIsCreateProfileOpen} darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative bg-slate-50 dark:bg-slate-950 transition-colors">
           {activeView === 'DASHBOARD' && <Home />}
           
           {activeView === 'PROFILES' && (
             selectedCandidateId ? (
                <div className="h-full flex flex-col">
                   <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0">
                      <button onClick={handleBackToProfiles} className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors">
                         <ChevronRight size={14} className="rotate-180"/> Back to Search
                      </button>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Candidate Profile</span>
                   </div>
                   
                   <CandidateProfile activeTab={activeProfileTab} />
                </div>
             ) : (
                <Profiles onNavigateToProfile={handleNavigateToProfile} view="SEARCH" />
             )
           )}

           {activeView === 'CAMPAIGNS' && (
             selectedCampaign ? (
                <div className="h-full flex flex-col">
                   <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0">
                      <button onClick={handleBackToCampaigns} className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors">
                         <ChevronRight size={14} className="rotate-180"/> Back to Campaigns
                      </button>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{selectedCampaign.name}</span>
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
