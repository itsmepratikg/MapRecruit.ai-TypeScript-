
# Changelog

## [Phase 5] - Debugging & Stabilization - 2026-01-26

### 🐛 Bug Fixes
- **Backend Stability**: Fixed a critical 500 Internal Server Error in `getWorkflow` by adding safe handling for invalid MongoDB ObjectIds (e.g., legacy ID "1").
- **Backend Stability**: Fixed a `ReferenceError` in `workflowController.js` by missing `mongoose` import.
- **Frontend Syntax**: Resolved an "Adjacent JSX elements" build error in `WorkflowBuilder.tsx` (duplicate closing `</div>`).
- **Frontend Imports**: Fixed a broken import for `QUICK_FILTERS` in `AttachPeople.tsx` (moved to `TalentSearchEngine.tsx`).
- **Frontend Rendering**: Fixed a "Cannot read properties of undefined (reading 'map')" crash in `CampaignHeader.tsx` by adding optional chaining for `campaign.members`.
- **Frontend Hooks**: Fixed a React warning in `useUserProfile.ts` by checking `isMounted` before state updates in async calls.
- **Performance**: Applied memoization to `handleNavigateToCampaign` in `App.tsx` (renamed to `handleCampaignClick`) to prevent infinite `useEffect` loops.

### 🗄️ Data Operations
- **Data Patch**: Updated `companyID` for Profile `69774e95cf3020c9148d7622` to resolve access control issues.
- **Data Import**: Imported two legacy resume JSON files (`resume_6965e3f1f40a2ed220a0dc17.json`, `resume_6965e3b8f40a2ed220a0dc16.json`) into MongoDB `resumesDB` with proper ObjectId casting.

### 🔧 Maintenance
- **Refactoring**: Standardized usage of `useParams` across Campaign pages.
- **Optimization**: Cleaned up usage of `isSidebarOpen` props in `DashboardMenu`.

---
