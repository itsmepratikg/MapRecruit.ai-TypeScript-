# Google Integration Setup Guide

This guide details the steps to configure a Google Cloud Project for MapRecruit. This integration enables "Sign in with Google" and Google Calendar/Drive synchronization.

## Prerequisites
- A Google Cloud Platform (GCP) account.
- Access to the [Google Cloud Console](https://console.cloud.google.com/).

## Step 1: Create a Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown at the top and select **New Project**.
3. Name your project (e.g., "MapRecruit Integration") and click **Create**.
4. Select your new project.

## Step 2: Enable APIs

1. Navigate to **APIs & Services** > **Library**.
2. Search for and enable the following APIs:
   - **Google People API** (For user profile and contacts)
   - **Google Calendar API** (For calendar sync)
   - **Google Drive API** (Optional: For file interactions)
   - **Gmail API** (Optional: For email integration)

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**.
2. Select **External** (Available to any user with a Google Account) or **Internal** (Only for users within your Google Workspace organization).
3. Click **Create**.
4. Fill in the App Information:
   - **App name**: MapRecruit
   - **User support email**: Your email
5. Click **Save and Continue**.
6. **Scopes**: Add the following scopes if prompted:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `.../auth/calendar.readonly` (or `.events`)
7. Add **Test Users** if the app is in "Testing" status.

## Step 4: Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**.
2. Click **Create Credentials** > **OAuth client ID**.
3. Select **Web application** as the application type.
4. Name it (e.g., "MapRecruit Web Client").
5. **Authorized JavaScript origins**:
   - **Development**: Check with the support team for your local port number (e.g., `http://localhost:PORT`).
   - **Production**: `https://*.maprecruit.com`
   - **QA/UAT**: `https://*qa.maprecruit.com`
6. **Authorized redirect URIs**:
   - `http://localhost:PORT` (Development)
   - `http://localhost:PORT/auth/google/callback` (Development)
   - `https://*.maprecruit.com/auth/google/callback` (Production)
   - `https://*qa.maprecruit.com/auth/google/callback` (QA/UAT)
7. Click **Create**.
8. Copy the **Client ID** and **Client Secret**.

## Step 5: Service Account (Optional - Server-to-Server)

If your application needs to access data without user interaction (e.g., background sync for enterprise):

1. Go to **IAM & Admin** > **Service Accounts**.
2. Click **Create Service Account**.
3. Name it and click **Create**.
4. Grant access (Optional) or skip.
5. Click on the created service account > **Keys** tab.
6. Click **Add Key** > **Create new key** > **JSON**.
7. The JSON file will download automatically. This is your **Service Account JSON**.

## Step 6: Gmail Add-on (Optional)

To enable the "Push to MapRecruit" sidebar in Gmail, you need to create a Google Apps Script project.

### appsscript.json (Manifest)
Update `timeZone` as needed.

```json
{
    "timeZone": "America/New_York",
    "dependencies": {},
    "oauthScopes": [
        "https://www.googleapis.com/auth/gmail.addons.execute",
        "https://www.googleapis.com/auth/gmail.addons.current.message.readonly",
        "https://www.googleapis.com/auth/script.external_request"
    ],
    "gmail": {
        "contextualTriggers": [
            {
                "unconditional": {},
                "onTriggerFunction": "buildAddOn"
            }
        ]
    }
}
```

### Code.js (Script Logic)
**Note**: Replace `"https://your-backend-url.com/api/v1/upload"` with your actual backend endpoint.

```javascript
function buildAddOn(e) {
    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection();

    var pushButton = CardService.newTextButton()
        .setText("Push Attachment to Server")
        .setOnClickAction(CardService.newAction().setFunctionName("pushToServer"));

    section.addWidget(CardService.newButtonSet().addButton(pushButton));
    card.addSection(section);

    return card.build();
}

function pushToServer(e) {
    var messageId = e.gmail.messageId;
    GmailApp.setCurrentMessageAccessToken(e.gmail.accessToken);
    var message = GmailApp.getMessageById(messageId);
    var attachments = message.getAttachments();

    if (attachments.length === 0) {
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification().setText("No attachments found."))
            .build();
    }

    var fileBlob = attachments[0];

    // NOTE: Replace with your actual public backend URL (ngrok or deployed)
    // Google Apps Script cannot hit 'localhost'
    var url = "https://your-backend-url.com/api/v1/upload";

    var options = {
        "method": "POST",
        "payload": {
            "file": fileBlob,
            "fileName": fileBlob.getName()
        },
        "muteHttpExceptions": true
    };

    try {
        var response = UrlFetchApp.fetch(url, options);
        var code = response.getResponseCode();
        var text = response.getContentText();

        if (code === 200 || code === 201) {
            return CardService.newActionResponseBuilder()
                .setNotification(CardService.newNotification().setText("Success! File pushed."))
                .build();
        } else {
            return CardService.newActionResponseBuilder()
                .setNotification(CardService.newNotification().setText("Error: " + code))
                .build();
        }
    } catch (err) {
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification().setText("Network Error: " + err.message))
            .build();
    }
}
```

## Step 7: Configure MapRecruit

1. Go to your MapRecruit **Workspace Configurations** page.
2. Select **Google Calendar**.
3. Enter your **Client ID** and **Client Secret** (for OAuth).
4. If using a Service Account, copy the contents of the downloaded JSON file into the **Service Account JSON** field.
5. Click **Save Settings**.

## Troubleshooting
- **403 Access Denied**: Ensure the user has been added to "Test Users" if the app is not verified by Google.
- **Origin Mismatch**: The request origin must exactly match the "Authorized JavaScript origins".
- **Verification**: For production use with sensitive scopes (like Calendar), your app may need to pass Google's verification process.
