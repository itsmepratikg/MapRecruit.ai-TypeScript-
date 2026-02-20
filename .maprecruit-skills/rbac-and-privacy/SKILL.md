---
name: rbac-and-privacy
description: Manages role-based access control and user privacy patterns. Use when modifying permissions or filtering sensitive data.
---

# RBAC and Privacy Skill

Protects user data and enforces organizational boundaries.

## When to use this skill

- When implementing permission checks.
- When filtering search results based on Client or Company access.
- When handling user impersonation or session-sensitive data.

## How to use it

### 1. Access Control
- **Authorization**: Always verify that the user has access to the specific `ClientID` or `CompanyID` of the resource.
- **404 Over 403**: For unauthorized access to specific profiles, display a "404 Page Not Found" UI to hide the existence of the resource from unauthorized eyes.

### 2. Data Filtering
- **Self-Filter**: Filter out the current user's own data from group views (e.g., co-presence avatars).
- **Client Isolation**: Strictly enforce `Profile Search Access Level` (Company vs. Client).

### 3. Session Security
- Enforce 30-minute inactivity timeouts (banking-style logout).
- Ensure sensitive keys are never exposed in console logs or network payloads.

### 4. External Integrations
- Refer to `RBAC-EXTERNAL-PERMISSIONS.md` for a comprehensive list of required scopes for Microsoft Graph and Google APIs.
- Ensure that `Application Permissions` (like `Sites.Read.All`) are only granted to backend services, never to client-side tokens.
