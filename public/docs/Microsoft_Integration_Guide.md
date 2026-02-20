# Microsoft Integration Setup Guide

This guide details the steps to configure a Microsoft Entra ID (formerly Azure AD) application for MapRecruit. This integration allows users to sign in with their Microsoft accounts and sync Outlook calendars.

## Prerequisites
- A Microsoft Azure account with an active subscription.
- Administrator access to your Microsoft Entra ID tenant.

## Step 1: Register an Application

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).
2. Navigate to **Identity** > **Applications** > **App registrations**.
3. Click **New registration**.
4. Enter a **Name** for your application (e.g., "MapRecruit Integration").
5. Under **Supported account types**, select:
   - **Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant)** if you want to allow users from other companies to log in.
   - **Accounts in this organizational directory only (Single tenant)** if this app is internal only.
6. Under **Redirect URI**, select **Single-page application (SPA)** and enter your application's redirect URLs:
   - **Development**: Check with the support team for your local port number (e.g., `http://localhost:PORT`).
   - **Production**: `https://*.maprecruit.com`
   - **QA/UAT**: `https://*qa.maprecruit.com`
7. Click **Register**.

## Step 2: Configure Authentication

1. In your app's overview page, go to **Authentication** in the left menu.
2. Under **Implicit grant and hybrid flows**, ensure **Access tokens** and **ID tokens** are checked (if using implicit flow, though MSAL 2.0+ uses Auth Code flow with PKCE, enabling these provides compatibility if needed, but for SPA primarily ensure Redirect URIs are correct).
3. Click **Save**.

## Step 3: Add API Permissions

1. Go to **API permissions** in the left menu.
2. Click **Add a permission** > **Microsoft Graph** > **Delegated permissions**.
3. Search for and select the following permissions:
   - `User.Read` (Sign in and read user profile)
   - `Calendars.Read` (Read user calendars - required for sync)
   - `Calendars.ReadWrite` (Optional: if you plan to create events)
   - `offline_access` (Maintain access to data via Refresh Tokens)
4. Click **Add permissions**.
5. **Important**: If you are setting this up as a Single Tenant app for backend sync, you might need **Application permissions** instead of Delegated, but for user login and calendar sync, Delegated is standard.

## Step 4: Create a Client Secret (For Backend Sync)

*Note: Required only if the backend needs to perform actions on behalf of the user offline or for Single Tenant flows.*

1. Go to **Certificates & secrets** in the left menu.
2. Under **Client secrets**, click **New client secret**.
3. Add a description and select an expiration period.
4. Click **Add**.
5. **Copy the Value immediately**. This is your **Client Secret**. You will not be able to see it again.

## Step 5: Configure MapRecruit

1. Go to your MapRecruit **Workspace Configurations** page.
2. Select **Microsoft Outlook**.
3. Enter your **Application (Client) ID** (found on the Overview page).
4. Enter your **Client Secret**.
5. (Optional) Enter your **Directory (Tenant) ID** if using Single Tenant mode.
6. Click **Save Settings**.

## Step 6: Outlook Add-in (Optional)

If you are deploying the Outlook Add-in, use the following `manifest.xml` template.
**Note**: You must update the `AppDomain` and `SourceLocation` URLs to match your environment.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<OfficeApp
  xmlns="http://schemas.microsoft.com/office/appforoffice/1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bt="http://schemas.microsoft.com/office/officeappbasictypes/1.0"
  xmlns:mailappor="http://schemas.microsoft.com/office/mailappversionoverrides"
  xsi:type="MailApp">
  <Id>71c220fa-f38b-4c4f-9516-017633215907</Id>
  <Version>1.0.0.0</Version>
  <ProviderName>MapRecruit</ProviderName>
  <DefaultLocale>en-US</DefaultLocale>
  <DisplayName DefaultValue="Push to MapRecruit" />
  <Description DefaultValue="Push email attachments to MapRecruit Server." />
  <IconUrl DefaultValue="https://YOUR_DOMAIN/assets/icon-32.png" />
  <HighResolutionIconUrl DefaultValue="https://YOUR_DOMAIN/assets/icon-64.png" />
  <SupportUrl DefaultValue="https://maprecruit.ai/support" />
  <AppDomains>
    <AppDomain>https://YOUR_BACKEND_URL</AppDomain> <!-- Backend URL -->
  </AppDomains>
  <Hosts>
    <Host Name="Mailbox" />
  </Hosts>
  <Requirements>
    <Sets>
      <Set Name="Mailbox" MinVersion="1.1" />
    </Sets>
  </Requirements>
  <FormSettings>
    <Form xsi:type="ItemRead">
      <DesktopSettings>
        <SourceLocation DefaultValue="https://YOUR_DOMAIN/taskpane.html"/>
        <RequestedHeight>250</RequestedHeight>
      </DesktopSettings>
    </Form>
  </FormSettings>
  <Permissions>ReadWriteItem</Permissions>
  <Rule xsi:type="RuleCollection" Mode="Or">
    <Rule xsi:type="ItemIs" ItemType="Message" FormType="Read" />
  </Rule>
  <DisableEntityHighlighting>false</DisableEntityHighlighting>
  <VersionOverrides xmlns="http://schemas.microsoft.com/office/mailappversionoverrides" xsi:type="VersionOverridesV1_0">
    <Hosts>
      <Host xsi:type="MailHost">
        <DesktopFormFactor>
          <FunctionFile resid="Taskpane.Url" />
          <ExtensionPoint xsi:type="MessageReadCommandSurface">
            <OfficeTab id="TabDefault">
              <Group id="msgReadGroup">
                <Label resid="GroupLabel" />
                <Control xsi:type="Button" id="msgReadOpenPaneButton">
                  <Label resid="TaskpaneButton.Label" />
                  <Supertip>
                    <Title resid="TaskpaneButton.Label" />
                    <Description resid="TaskpaneButton.Tooltip" />
                  </Supertip>
                  <Icon>
                    <bt:Image size="16" resid="Icon.16x16" />
                    <bt:Image size="32" resid="Icon.32x32" />
                    <bt:Image size="80" resid="Icon.80x80" />
                  </Icon>
                  <Action xsi:type="ShowTaskpane">
                    <SourceLocation resid="Taskpane.Url" />
                  </Action>
                </Control>
              </Group>
            </OfficeTab>
          </ExtensionPoint>
        </DesktopFormFactor>
      </Host>
    </Hosts>
    <Resources>
      <bt:Images>
        <bt:Image id="Icon.16x16" DefaultValue="https://YOUR_DOMAIN/assets/icon-16.png"/>
        <bt:Image id="Icon.32x32" DefaultValue="https://YOUR_DOMAIN/assets/icon-32.png"/>
        <bt:Image id="Icon.80x80" DefaultValue="https://YOUR_DOMAIN/assets/icon-80.png"/>
      </bt:Images>
      <bt:Urls>
        <bt:Url id="Taskpane.Url" DefaultValue="https://YOUR_DOMAIN/taskpane.html" />
      </bt:Urls>
      <bt:ShortStrings>
        <bt:String id="GroupLabel" DefaultValue="MapRecruit" />
        <bt:String id="TaskpaneButton.Label" DefaultValue="Push to Server" />
      </bt:ShortStrings>
      <bt:LongStrings>
        <bt:String id="TaskpaneButton.Tooltip" DefaultValue="Upload attachments to MapRecruit" />
      </bt:LongStrings>
    </Resources>
  </VersionOverrides>
</OfficeApp>
```

## Troubleshooting
- **Limit Exceeded**: If users see an admin approval required message, verify that "Admin consent" is not strictly enforced for basic permissions in your Enterprise Application settings, or grant admin consent for the requested permissions in the App Registration.
- **Redirect URI Mismatch**: Ensure the URL in your browser exactly matches one of the Redirect URIs configured in Azure.
