
# Changelog

All notable changes to the **MapRecruit ATS Dashboard** project will be documented in this file.

## [Phase 5.1] - Profile Widgets Enhancement - 2026-01-26

### 🚀 Features & UX
- **Widget Overflow System**: Implemented a dynamic "More" (`...`) menu for Profile Header widgets, ensuring a clean UI with max 6 visible items regardless of enabled features.
- **Shortlist Popover**: Added precise Accept/Reject actions when clicking the Shortlist status icon, improving recruiter workflow speed.
- **Opt-Out Management**: Integrated a comprehensive `OptOutModal` allowing granular opt-out for specific Email IDs and Phone Numbers.
- **Top-Right Positioning**: Relocated actions to the top-right for better visual hierarchy.

### 🐛 Bug Fixes
- **Component Rendering**: Fixed `HeroWidgets.tsx` not updating correctly in previous deployments due to file-write conflicts.
- **State Management**: Restored missing state handlers for Modals in `CandidateProfile.tsx`.


## [Phase 5] - Debugging & Stabilization - 2026-01-26

### 🐛 Bug Fixes
- **Backend Stability**: Fixed a critical 500 Internal Server Error in `getWorkflow` by adding safe handling for invalid MongoDB ObjectIds.
- **Backend Stability**: Fixed a `ReferenceError` in `workflowController.js` by missing `mongoose` import.
- **Frontend Syntax**: Resolved an "Adjacent JSX elements" build error in `WorkflowBuilder.tsx`.
- **Frontend Imports**: Fixed a broken import for `QUICK_FILTERS` in `AttachPeople.tsx`.
- **Frontend Rendering**: Fixed a crash in `CampaignHeader.tsx` by adding optional chaining for `campaign.members`.
- **Frontend Hooks**: Fixed a React warning in `useUserProfile.ts` regarding async updates on unmounted components.
- **Performance**: Applied memoization to `handleCampaignClick` in `App.tsx` (renamed from `handleNavigateToCampaign`) to prevent infinite re-renders.

### 🗄️ Data Operations
- **Data Patch**: Updated `companyID` for Profile `69774...` to resolve access control issues.
- **Data Import**: Imported legacy resume JSON files into MongoDB with proper ObjectId casting.

---

## [Phase 4] - Activity & Timeline - 2025-05-24

### 🕒 Timeline Features
- **Audit Logs**: Implemented `Activities` collection tracking all user actions (Candidate views, status changes, notes).
- **Visual Timeline**: Added a vertical timeline widget to `CandidateProfile` showing chronological history of interactions.
- **Live Updates**: Connected timeline components to real-time socket events for immediate feedback.

---

## [Phase 3] - Engage & Automation - 2025-05-23

### 🤖 Workflow Builder
- **Visual Editor**: Developed a node-based editor for designing recruitment workflows (Announcements, Screening, Interviews).
- **Node Configuration**: Added modals for configuring automation rules, email templates, and delays.
- **MongoDB Integration**: Migrated workflow nodes and edges to the `Workflows` collection for persistence.

### 🧠 Engage AI
- **Job Fit Score**: Implemented backend schema and UI sliders for calibrating candidate match weights.
- **Interview Management**: Created `ScreeningRound` logic allowing custom question templates for varied interview types.
- **Permissions**: Added `ShareAccessLevel` to workflows for granular team collaboration.

---

## [Phase 2] - Campaigns & Marketplace - 2025-05-22

### 📢 Campaign Management
- **Dashboard**: Refactored the sidebar to group campaigns by Client/Company dynamically from the database.
- **Intelligence Hub**: Added overview widgets for Team Notes, Reminders, and Panel Members.
- **Pipeline Visualization**: Integrated Sourcing Efficiency and Pipeline Health charts using Recharts.

### 🔎 Search Engine
- **Filters**: Linked Campaign page filters to MongoDB queries (Location, Pay Rate, Skills).
- **Match AI**: Implemented visual match scores and Radar Charts for candidate-job alignment.

---

## [Phase 1] - Foundation & Profiles - 2025-05-20

### 🏗️ Core Architecture
- **Dashboard Grid**: Implemented `GridStack.js` for a draggable, customizable home dashboard.
- **Theming**: Added global Theme Switcher (Emerald, Blue, Purple) and dark mode via Tailwind.
- **Authentication**: Set up basic JWT-based auth flow and user context providers.

### 👤 Candidate Profiles
- **Data Layer**: Implemented `candidateService` and `useCandidateProfile` hooks for fetching MongoDB data.
- **Profile View**: Built the comprehensive `CandidateProfile` page with Resume parsing, Tag management, and Hero Widgets.
- **Resume Parsing**: Integrated logic to map complex JSON resume structures to UI components.

---
