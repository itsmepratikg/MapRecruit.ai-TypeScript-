# Testing Plan - MapRecruit ATS v1.3.0

## Phase 1: Core Navigation & Dashboard
**Objective**: Verify the integrity of the application frame and the main landing page.

| ID | Feature | Steps | Expected Result | Priority |
|:---|:---|:---|:---|:---|
| **NAV-001** | Sidebar Toggle | 1. Open Desktop view.<br>2. Click Menu icon (if applicable) or verify expanded state.<br>3. Resize to Tablet.<br>4. Verify Sidebar collapses. | Sidebar transitions smoothly; Content expands to fill space. | Medium |
| **NAV-002** | Global Search | 1. Press `Cmd+K` (or `Ctrl+K`).<br>2. Type "Dash".<br>3. Select "Dashboard". | Global Search modal opens; Navigation redirects to Dashboard. | High |
| **DASH-001** | Widget Layout | 1. Navigate to Dashboard.<br>2. Observe widget positions. | All widgets (Trend, Distribution, Metrics) load without overlap. | High |
| **DASH-002** | Theme Switch | 1. Open Sidebar Footer/Settings.<br>2. Switch to Dark Mode. | All dashboard components invert colors correctly. | Medium |

## Phase 2: Profiles & Talent Search
**Objective**: Validate candidate discovery and management.

| ID | Feature | Steps | Expected Result | Priority |
|:---|:---|:---|:---|:---|
| **PROF-001** | Search Filtering | 1. Go to Profiles.<br>2. Enter "Developer" in search bar.<br>3. Click Search. | Results list updates to show only matching candidates. | Critical |
| **PROF-002** | Profile View | 1. Click on a Candidate Name.<br>2. Verify "Resume" tab loads. | Candidate Profile overlay appears; Resume PDF/Viewer is visible. | Critical |
| **PROF-003** | Folder Add | 1. Select a candidate.<br>2. Click "Add to Folder".<br>3. Select "Favorites". | Toast message "Added to Favorites"; Icon updates. | High |

## Phase 3: Campaign Module
**Objective**: Test the end-to-end recruitment lifecycle tools.

| ID | Feature | Steps | Expected Result | Priority |
|:---|:---|:---|:---|:---|
| **CAMP-001** | Navigation | 1. Go to Campaigns.<br>2. Select a Campaign.<br>3. Switch tabs (Intelligence -> Source -> Match -> Engage). | View updates without page reload; URL might change. | High |
| **CAMP-002** | Match AI Radar | 1. Go to Match AI tab.<br>2. View Candidate list.<br>3. Check Radar Chart. | Radar chart renders with data points (Skills, Exp, etc.). | Medium |
| **CAMP-003** | Workflow Builder | 1. Go to Engage AI tab.<br>2. Drag a new node to canvas.<br>3. Connect two nodes. | Node is placed; Edge line connects them successfully. | Critical |

## Phase 4: Settings & New Hubs
**Objective**: Check configuration and auxiliary modules.

| ID | Feature | Steps | Expected Result | Priority |
|:---|:---|:---|:---|:---|
| **SET-001** | User Edit | 1. Go to Settings -> Users.<br>2. Select a User.<br>3. Edit Name.<br>4. Save. | Name updates in list and top navbar (if self). | High |
| **CAL-001** | Calendar View | 1. Go to Calendar Hub.<br>2. Switch tabs (Events/Availability). | Placeholder or Actual components load without crash. | Low |
