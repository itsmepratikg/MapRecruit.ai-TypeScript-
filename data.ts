
import {
  FileText, Settings, Link, Mail, Video, MessageSquare, HelpCircle, Megaphone, GitBranch, ListChecks, CheckCircle2, Pilcrow, MoveRight, Film, MapPin, Map, MinusCircle, Briefcase, Users, UserCheck
} from './components/Icons';
import { Candidate, EngageNode, EngageEdge, Question, Campaign, PanelMember, CampaignActivity, Tag } from './types';


// --- MOCK USERS ---
export const MOCK_USERS_LIST = [
  { _id: '65f1a2b3c4d5e6f7a8b9c0d1', id: 'usr_101', name: 'Sarah Jenkins', role: 'Recruiter', email: 'sarah.j@maprecruit.ai', avatar: null, initials: 'SJ', color: 'bg-indigo-100 text-indigo-700' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d2', id: 'usr_102', name: 'Mike Ross', role: 'Hiring Manager', email: 'mike.ross@maprecruit.ai', avatar: null, initials: 'MR', color: 'bg-blue-100 text-blue-700' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d3', id: 'usr_103', name: 'David Chen', role: 'Sourcing Lead', email: 'david.chen@maprecruit.ai', avatar: null, initials: 'DC', color: 'bg-purple-100 text-purple-700' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d4', id: 'usr_104', name: 'Aleisa Hodgens', role: 'Admin', email: 'aleisa.h@maprecruit.ai', avatar: null, initials: 'AH', color: 'bg-orange-100 text-orange-700' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d5', id: 'usr_105', name: 'Vinay Kashyap', role: 'Admin', email: 'vinay.k@maprecruit.ai', avatar: null, initials: 'VK', color: 'bg-amber-100 text-amber-700' },
  { _id: '696a1d32e8ceec1d15098204', id: 'usr_123', name: 'Pratik Gaurav', role: 'Product Admin', email: 'pratik.gaurav@maprecruit.ai', avatar: null, initials: 'PG', color: 'bg-emerald-100 text-emerald-700' },
];

export const MOCK_TAGS: Tag[] = [
  {
    id: 1,
    name: "Java Developer",
    description: "Candidates with strong Java backend experience",
    profilesCount: 120,
    createdDate: "2024-03-15",
    updatedDate: "2024-05-20",
    createdBy: "Pratik Gaurav",
    access: { level: 'COMPANY', ownerId: 'usr_123', sharedWith: [] }
  },
  {
    id: 2,
    name: "Immediate Joiner",
    description: "Candidates available to join within 15 days",
    profilesCount: 85,
    createdDate: "2024-02-10",
    updatedDate: "2024-05-18",
    createdBy: "Sarah Jenkins",
    access: {
      level: 'PRIVATE',
      ownerId: 'usr_101',
      sharedWith: [
        { entityId: 'usr_123', entityName: 'Pratik Gaurav', entityType: 'USER', permission: 'VIEW', role: 'Product Admin', avatar: 'PG' }
      ]
    }
  },
  {
    id: 3,
    name: "Warehouse Ops",
    description: "Experience in warehouse operations and logistics",
    profilesCount: 210,
    createdDate: "2024-01-05",
    updatedDate: "2024-04-22",
    createdBy: "Mike Ross",
    access: { level: 'CLIENT', clientId: 'Amazon', ownerId: 'usr_102', sharedWith: [] }
  },
  {
    id: 4,
    name: "React Frontend",
    description: "React.js, Redux, and modern frontend stack",
    profilesCount: 95,
    createdDate: "2024-04-01",
    updatedDate: "2024-05-21",
    createdBy: "Pratik Gaurav",
    access: { level: 'PRIVATE', ownerId: 'usr_123', sharedWith: [] }
  },
  {
    id: 5,
    name: "Certified Scrum Master",
    description: "CSM certification required",
    profilesCount: 45,
    createdDate: "2023-11-20",
    updatedDate: "2024-03-10",
    createdBy: "David Chen",
    access: { level: 'COMPANY', ownerId: 'usr_103', sharedWith: [] }
  },
  {
    id: 6,
    name: "Remote Only",
    description: "Candidates looking for remote opportunities",
    profilesCount: 150,
    createdDate: "2024-01-15",
    updatedDate: "2024-05-01",
    createdBy: "Sarah Jenkins",
    access: {
      level: 'PRIVATE',
      ownerId: 'usr_101',
      sharedWith: [
        { entityId: 'usr_123', entityName: 'Pratik Gaurav', entityType: 'USER', permission: 'EDIT', role: 'Product Admin', avatar: 'PG' },
        { entityId: 'usr_102', entityName: 'Mike Ross', entityType: 'USER', permission: 'VIEW', role: 'Hiring Manager', avatar: 'MR' }
      ]
    }
  }
];

export const PANEL_MEMBERS: PanelMember[] = [
  { id: 1, name: "QA Team Admin (Product Admin)", role: "QA Team Admin (Product Admin)", subRole: "Owner", initials: "QT", color: "bg-red-800 text-white" },
  { id: 2, name: "QA Team Admin (Product Admin)", role: "QA Team Admin (Product Admin)", subRole: "Recruiter", initials: "QT", color: "bg-red-800 text-white" },
  { id: 3, name: "Vinay Kashyap (Admin)", role: "Vinay Kashyap (Admin)", subRole: "Recruiter", initials: "VK", color: "bg-amber-700 text-white" },
  { id: 4, name: "Aleisa Hodgens (Admin)", role: "Aleisa Hodgens (Admin)", subRole: "Recruiter", initials: "AH", color: "bg-orange-700 text-white" },
  { id: 5, name: "Jaycee Smith (Recruiter)", role: "Jaycee Smith (Recruiter)", subRole: "Recruiter", initials: "JS", color: "bg-yellow-600 text-white" }
];


// --- FLOW / GRAPH DATA ---

export const NODE_TYPES: any = {
  ANNOUNCEMENT: { color: "bg-purple-100 border-purple-300 text-purple-700", icon: Mail, label: "Announcement" },
  SCREENING: { color: "bg-blue-100 border-blue-300 text-blue-700", icon: FileText, label: "Screening" },
  INTERVIEW: { color: "bg-orange-100 border-orange-300 text-orange-700", icon: Video, label: "Interview" },
  SURVEY: { color: "bg-teal-100 border-teal-300 text-teal-700", icon: MessageSquare, label: "Survey" },
};

export const INITIAL_NODES: EngageNode[] = [
  {
    id: '1',
    type: 'ANNOUNCEMENT',
    title: 'Welcome Email',
    x: 50, y: 300,
    data: {
      desc: "Automated greeting",
      stats: { scheduled: 120, viewed: 45 }
    }
  },
  {
    id: '2',
    type: 'SCREENING',
    title: 'Gen. Screening',
    x: 350, y: 300,
    data: {
      desc: "Basic qualifications",
      stats: { scheduled: 80, responded: 65 }
    }
  },
  {
    id: '3',
    type: 'SCREENING',
    title: 'Skill Check',
    x: 650, y: 300,
    data: {
      desc: "Branch by Tech Stack",
      stats: { scheduled: 80, responded: 75 }
    }
  },
  {
    id: '4a',
    type: 'SCREENING',
    title: 'React Quiz',
    x: 950, y: 100,
    data: {
      desc: "Component lifecycle",
      stats: { scheduled: 25, responded: 20 }
    }
  },
  {
    id: '4b',
    type: 'SURVEY',
    title: 'Feedback Survey',
    x: 950, y: 300,
    data: {
      desc: "Candidate Experience",
      stats: { scheduled: 30, responded: 12 }
    }
  },
  {
    id: '4c',
    type: 'SCREENING',
    title: 'Vue.js Quiz',
    x: 950, y: 500,
    data: {
      desc: "Vuex & Directives",
      stats: { scheduled: 15, responded: 14 }
    }
  },
  {
    id: '5a',
    type: 'INTERVIEW',
    title: 'Modern FE Interview',
    x: 1300, y: 150,
    data: {
      desc: "React & Vue Candidates",
      meetType: ['Video'],
      stats: { scheduled: 15, booked: 10 }
    }
  },
  {
    id: '5b',
    type: 'INTERVIEW',
    title: 'Enterprise FE Interview',
    x: 1300, y: 400,
    data: {
      desc: "Angular Candidates",
      meetType: ['In-Person'],
      stats: { scheduled: 5, booked: 2 }
    }
  },
];

export const INITIAL_EDGES: EngageEdge[] = [
  { from: '1', to: '2' },
  { from: '2', to: '3' },
  { from: '3', to: '4a', label: 'React' },
  { from: '3', to: '4b', label: 'Angular' },
  { from: '3', to: '4c', label: 'Vue.js' },
  { from: '4a', to: '5a' },
  { from: '4c', to: '5a' },
  { from: '4b', to: '5b' },
];

export const MOCK_QUESTIONS_DATA: Question[] = [
  {
    id: 1,
    questionText: "Which of the following are valid Python data types?",
    questionType: "Standard",
    responseType: "Multiple Correct",
    options: [
      { text: "List", responses: 45 },
      { text: "Dictionary", responses: 42 },
      { text: "Tuple", responses: 38 },
      { text: "Class", responses: 15 }
    ],
    responses: 140
  },
  {
    id: 4,
    questionText: "What is the capital of France?",
    questionType: "Standard",
    responseType: "Single Correct",
    options: [
      { text: "Berlin", responses: 2 },
      { text: "Madrid", responses: 5 },
      { text: "Paris", responses: 58 },
      { text: "Rome", responses: 1 }
    ],
    responses: 66
  },
  {
    id: 6,
    questionText: "Select the name you have listened to in Audio",
    questionType: "Flowchart",
    responseType: "Branching Logic",
    options: [],
    responses: 15
  },
  {
    id: 9,
    questionText: "Provide the Video response for this GIF",
    questionType: "Standard",
    responseType: "GIF",
    options: [],
    responses: 7
  },
  {
    id: 3,
    questionText: "Please upload a short video introducing yourself.",
    questionType: "Standard",
    responseType: "Video",
    options: [],
    responses: 3
  },
  {
    id: 10,
    questionText: "What is your current work location?",
    questionType: "Standard",
    responseType: "Single Location",
    options: [],
    responses: 65
  },
  {
    id: 5,
    questionText: "Welcome to the assessment! Click 'Continue'.",
    questionType: "Announcement",
    responseType: "None",
    options: [],
    responses: null
  },
];

export const MOCK_CANDIDATES_CAMPAIGN: Candidate[] = [
  { id: 1, name: "Sarah Jenkins", role: "Frontend Developer (React)", stage: "Interview (3a)", status: "Pending", avatar: "SJ", campaigns: [], recommended: [], similar: [], tags: [], contact: { email: '', phone: '', altPhone: '' }, summary: '', skills: [], experience: [], education: [], activities: [] },
  { id: 2, name: "David Chen", role: "Frontend Developer (Angular)", stage: "Screening (2b)", status: "Completed", avatar: "DC", campaigns: [], recommended: [], similar: [], tags: [], contact: { email: '', phone: '', altPhone: '' }, summary: '', skills: [], experience: [], education: [], activities: [] },
  { id: 3, name: "Maria Garcia", role: "Fullstack (Vue.js)", stage: "Screening (2c)", status: "In Progress", avatar: "MG", campaigns: [], recommended: [], similar: [], tags: [], contact: { email: '', phone: '', altPhone: '' }, summary: '', skills: [], experience: [], education: [], activities: [] },
];

export const INTERVIEW_TEMPLATES = [
  { id: 1, title: "Phone Call Interview", created: "11/29/2022", author: "Pratik", access: "Company" },
  { id: 2, title: "Basic Interview Questions", created: "04/02/2024", author: "Pratik", access: "Company" },
  { id: 3, title: "Technical Screening - L1", created: "01/15/2025", author: "System", access: "Public" }
];

export const MOCK_PROFILES = [
  { id: 'PRO_001', name: 'Sarah Jenkins', title: 'Senior Frontend Developer', location: 'New York, NY', status: 'Active', avatar: 'SJ' },
  { id: 'PRO_002', name: 'David Chen', title: 'Backend Engineer', location: 'San Francisco, CA', status: 'On Bench', avatar: 'DC' },
  { id: 'PRO_003', name: 'Maria Garcia', title: 'Fullstack Developer', location: 'Austin, TX', status: 'Active', avatar: 'MG' },
  { id: 'PRO_004', name: 'James Wilson', title: 'UI/UX Designer', location: 'Remote', status: 'Active', avatar: 'JW' },
  { id: 'PRO_005', name: 'Priya Sharma', title: 'Data Scientist', location: 'Seattle, WA', status: 'On Bench', avatar: 'PS' },
  { id: 'PRO_006', name: 'Michael Brown', title: 'DevOps Engineer', location: 'Chicago, IL', status: 'Active', avatar: 'MB' },
];

// QUICK_FILTERS and SIDEBAR_FILTERS moved to TalentSearchEngine.tsx



// --- DYNAMIC FULL PROFILE DATA ---

// --- SINGLE CANDIDATE MOCK FOR PROFILE VIEWS ---
export const CANDIDATE = {
  id: 'cand_001',
  name: "Sarah Jenkins",
  role: "Frontend Developer",
  location: "New York, NY",
  about: "Experienced Frontend Developer with 5+ years in React and TypeScript.",
  recommended: [
    { id: 101, name: "Senior React Developer", jobID: "JOB-2024-001", location: "Remote", company: "TechCorp Inc." },
    { id: 102, name: "Frontend Engineer", jobID: "JOB-2024-045", location: "New York, NY", company: "FinanceFlow" },
    { id: 103, name: "UI/UX Developer", jobID: "JOB-2024-112", location: "Remote", company: "CreativeStudio" }
  ],
  similar: [
    { id: 201, name: "Michael Chen", role: "Frontend Dev", location: "San Francisco, CA", score: 92 },
    { id: 202, name: "Priya Sharma", role: "React Developer", location: "Austin, TX", score: 88 },
    { id: 203, name: "James Wilson", role: "Web Developer", location: "Remote", score: 85 }
  ]
};
