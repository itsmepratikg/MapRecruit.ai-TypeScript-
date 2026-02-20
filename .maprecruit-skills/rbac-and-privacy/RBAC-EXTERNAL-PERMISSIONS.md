# External Integration Permissions Reference

**Last Updated:** 2026-02-18

This document serves as the single source of truth for all external API permissions required by the MapRecruit application.

---

## 1. Microsoft Graph API (Azure AD)

These permissions are configured in the **Azure Portal > App Registrations > API Permissions**.

### A. Delegated Permissions (User Login & Actions)
Used when a user signs in to the application (e.g., "Sign in with Microsoft", Outlook Add-in).

| Permission | Type | Admin Consent | Description | Justification |
| :--- | :--- | :---: | :--- | :--- |
| **User.Read** | Delegated | No | Sign in and read user profile | Required for basic login. |
| **email** | Delegated | No | View users' email address | Required to identify the user. |
| **openid** | Delegated | No | Sign users in | OpenID Connect standard. |
| **profile** | Delegated | No | View users' basic profile | Name, photo usage. |
| **offline_access** | Delegated | No | Maintain access to data | Required for Refresh Tokens. |
| **Files.Read** | Delegated | No | Read user files | (Optional) If user manually selects OneDrive files. |
| **Files.Read.All** | Delegated | No | Read all files user can access | Used by Outlook Add-in to read attachments. |
| **Mail.Read** | Delegated | No | Read user mail | Used by Outlook Add-in context. |

### B. Application Permissions (Server-to-Server)
Used by the backend to run background jobs (e.g., SharePoint Webhooks) without a signed-in user.

| Permission | Type | Admin Consent | Description | Justification |
| :--- | :--- | :---: | :--- | :--- |
| **Sites.Read.All** | Application | **YES** | Read items in all site collections | **CRITICAL**: Required to subscribe to SharePoint Drive webhooks. |
| **Files.Read.All** | Application | **YES** | Read all files in all site collections | **CRITICAL**: Required to download file content from Delta queries.<br>**INCLUDES**: Access to file metadata (Created By, Created Date, Last Modified). |

### C. Multi-Tenant Setup (Critical for "Common" App)
Since you are building a **Multi-Tenant** application (supporting multiple organizations), you cannot simply "Add Permissions" in your own portal for other customers.

**The Admin Consent Flow:**
1.  **Configure App**: In Azure Portal > Authentication, select "Accounts in any organizational directory (Any Azure AD directory - Multitenant)".
2.  **Onboarding Link**: You must provide a link for the **Customer's IT Admin** to grant "Admin Consent" to your app.
    *   **URL Format**:
        ```
        https://login.microsoftonline.com/common/adminconsent
        ?client_id=YOUR_CLIENT_ID
        &state=12345
        &redirect_uri=YOUR_REDIRECT_URI
        ```
3.  **Result**: When the admin consents, a "Service Principal" of your app is created in *their* tenant.
4.  **Backend Token**: Your backend must request tokens for the **specific customer tenant ID** (not `common`) to access that customer's data.
    *   `POST https://login.microsoftonline.com/{CUSTOMER_TENANT_ID}/oauth2/v2.0/token`

---

## 2. Google Cloud Platform (GCP)

These scopes are configured in **Google Cloud Console > APIs & Services > OAuth Consent Screen**.

### A. OAuth Scopes (User Login & Add-on)
Used when a user signs in or uses the Gmail Add-on.

| Scope | Description | Justification |
| :--- | :--- | :--- |
| `.../auth/userinfo.email` | View your email address | Basic Login. |
| `.../auth/userinfo.profile` | See your personal info | Basic Login. |
| `.../auth/gmail.addons.execute` | Run as a Gmail Add-on | **CRITICAL**: Required for the Gmail Sidebar Add-on. |
| `.../auth/gmail.addons.current.message.readonly` | View email message metadata | Required to read attachments in the Add-on. |
| `.../auth/script.external_request` | Connect to an external service | Required to POST attachments to MapRecruit backend. |

### B. Service Account Scopes (Server-to-Server)
Used by the backend for Drive Webhooks.

| Scope | Description | Justification |
| :--- | :--- | :--- |
| `https://www.googleapis.com/auth/drive.readonly` | View all Google Drive files | **CRITICAL**: Required to watch folders for changes.<br>**INCLUDES**: Access to file metadata (Owners, Created Time, Modified Time). |
| `https://www.googleapis.com/auth/drive` | See, edit, create, and delete files | (Alternative) If write access is needed later. |

---

## 3. Microsoft Teams Integration (Future Reference)
Based on the provided screenshot, these permissions are available but **NOT currently used** by the file integration system.

- `Calendars.ReadWrite` (Delegated)
- `Channel.Create` (Delegated)
- `ChannelMessage.Read.All` (Delegated)
- `Chat.Read` (Delegated)
- `Team.Create` (Delegated)
