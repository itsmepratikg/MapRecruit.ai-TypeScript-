# Product Requirements Document (PRD) - MapRecruit ATS v1.3.0

## 1. Introduction
MapRecruit ATS is an advanced Applicant Tracking System designed to leverage AI for sourcing, matching, and engaging talent. This document outlines the functional requirements for the v1.3.0 release, focusing on the Dashboard, Talent Search, and Campaign Intelligence modules.

## 2. Product Scope
The system aims to provide Recruiter, Admin, and Hiring Manager roles with a unified platform to:
- Visualize recruitment metrics.
- Search and manage candidate profiles.
- Create and execute recruitment campaigns.
- Automate candidate engagement workflows.

## 3. Key Features

### 3.1. Dashboard & Navigation
- **Dynamic Widgets**: Users can drag and drop widgets (Trend Graphs, Source Distribution, Metrics Cards).
- **Global Search**: `Cmd+K` access to navigate views, find candidates, or open campaigns.
- **Sidebar**: Collapsible (Desktop), Overlay (Mobile), and Mini (Tablet) states.
- **Theme**: Light/Dark mode support with color palette customization (Emerald, Blue, Purple).

### 3.2. Talent Search & Profiles
- **Search Engine**:
  - Keyword search with Boolean logic support.
  - Filters: Location, Radius, Pay Rate, Skills, and Availability.
  - AI Assistant: Natural language query interface for refining results.
- **Candidate Profile**:
  - **Overview**: Contact info, Skills, Experience, Education.
  - **Resume Viewer**: Integrated PDF viewer.
  - **Activity Log**: Timeline of system interactions.
  - **Folder Management**: Add candidates to custom folders (Favorites, Watchlist).

### 3.3. Campaign Management
Divided into four core pillars:
#### A. Intelligence
- **Pipeline Analysis**: Sankey diagrams showing candidate flow (Applied -> Screened -> Interviewed).
- **Efficiency Metrics**: Time-to-hire, Source effectiveness charts.
- **Team Activity**: Logs of team actions within the campaign.

#### B. Source AI
- **Talent Discovery**: Internal search engine to find and "Attach" candidates to the campaign.
- **Integration**: Placeholder for external job board scraping/posting.
- **Job Description**: Rich text editor for JD management.

#### C. Match AI
- **Scoring**: AI-driven match score (0-100%) based on JD vs Profile.
- **Analysis**: Radar charts comparing candidate attributes to job requirements.
- **Ranking**: Sortable list of candidates by match capability.

#### D. Engage AI
- **Workflow Builder**: Visual node-based editor for designing recruitment steps.
  - Nodes: Announcement, Screening (Video/Phone), Interview, Offer.
  - Edges: Logic paths (Accepted, Rejected, No Response).
- **Interview Panel**: Live scoring interface for interviewers with customizable scorecards.

### 3.4. System Hubs (New in v1.3.0)
- **Calendar**: Event management, Interview scheduling, Availability configuration.
- **Messages**: Unified inbox for Email/SMS/Chat.
- **Create Hub**: Centralized "Create New" actions for Profile, Campaign, Folder.
- **Synchronizations**: Config pages for Google/Outlook, Zoom/Teams, Drive integrations.

## 4. User Roles
- **Admin**: Full access to Settings, User Management, and all Campaigns.
- **Recruiter**: Access to Search, Campaign Creation, and Candidate Management.
- **Hiring Manager**: Restricted access to specific Campaigns and Interview Panels.

## 5. Technical Constraints
- **Platform**: Web (React/TypeScript).
- **Responsive**: Mobile-first design principles.
- **Browser Support**: Chrome, Firefox, Safari, Edge (Latest 2 versions).
