const Company = require('../models/Company');
const axios = require('axios');
const { Client } = require('@microsoft/microsoft-graph-client');


// @desc    Get Integration Settings (SECURE)
// @route   GET /api/v1/integration-settings
// @access  Private (Admin)
const getIntegrationSettings = async (req, res) => {
    try {
        const companyId = req.user.currentCompanyID || req.companyID;
        const company = await Company.findById(companyId)
            .select('productSettings.authenticationSettings')
            .populate('productSettings.authenticationSettings.workspaceConfiguration.google.metadata.updatedBy', 'firstName lastName')
            .populate('productSettings.authenticationSettings.workspaceConfiguration.microsoft.metadata.updatedBy', 'firstName lastName')
            .populate('productSettings.authenticationSettings.workspaceConfiguration.google.metadata.createdBy', 'firstName lastName')
            .populate('productSettings.authenticationSettings.workspaceConfiguration.microsoft.metadata.createdBy', 'firstName lastName');

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Initialize default if not present
        const authSettings = company.productSettings?.authenticationSettings || {};
        const workspaceConfig = authSettings.workspaceConfiguration || {
            google: { enable: false, mode: 'multi-tenant', clientId: '', clientSecret: '' },
            microsoft: { enable: false, mode: 'multi-tenant', clientId: '', clientSecret: '', tenantId: '' }
        };

        const secureWorkspaceConfig = {
            google: {
                ...workspaceConfig.google,
                clientSecret: workspaceConfig.google?.clientSecret ? { isSet: true } : { isSet: false },
                serviceAccountJson: workspaceConfig.google?.serviceAccountJson ? { isSet: true } : { isSet: false },
                metadata: workspaceConfig.google?.metadata
            },
            microsoft: {
                ...workspaceConfig.microsoft,
                clientSecret: workspaceConfig.microsoft?.clientSecret ? { isSet: true } : { isSet: false },
                metadata: workspaceConfig.microsoft?.metadata
            }
        };

        const response = {
            sessionTimeoutInMins: authSettings.sessionTimeoutInMins || 240,
            passwordSize: authSettings.passwordSize || 10,
            maxPasswordSize: authSettings.maxPasswordSize || 30,
            passwordExpiryInDays: authSettings.passwordExpiryInDays || 90,
            ssoProvider: authSettings.ssoProvider || '',
            sso: authSettings.sso || false,
            workspaceConfiguration: secureWorkspaceConfig
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching integration settings:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Integration Settings
// @route   PUT /api/v1/integration-settings
// @access  Private (Admin)
const updateIntegrationSettings = async (req, res) => {
    try {
        const companyId = req.user.currentCompanyID || req.companyID;
        const {
            sessionTimeoutInMins,
            passwordSize,
            maxPasswordSize,
            passwordExpiryInDays,
            ssoProvider,
            sso,
            workspaceConfiguration
        } = req.body;

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Ensure path existence
        if (!company.productSettings) company.productSettings = {};
        if (!company.productSettings.authenticationSettings) company.productSettings.authenticationSettings = {};

        // Update General Settings
        if (sessionTimeoutInMins !== undefined) company.productSettings.authenticationSettings.sessionTimeoutInMins = sessionTimeoutInMins;
        if (passwordSize !== undefined) company.productSettings.authenticationSettings.passwordSize = passwordSize;
        if (maxPasswordSize !== undefined) company.productSettings.authenticationSettings.maxPasswordSize = maxPasswordSize;
        if (passwordExpiryInDays !== undefined) company.productSettings.authenticationSettings.passwordExpiryInDays = passwordExpiryInDays;
        if (ssoProvider !== undefined) company.productSettings.authenticationSettings.ssoProvider = ssoProvider;
        if (sso !== undefined) company.productSettings.authenticationSettings.sso = sso;

        // Update Workspace Configuration
        if (workspaceConfiguration) {
            const currentConfig = company.productSettings.authenticationSettings.workspaceConfiguration || { google: {}, microsoft: {} };

            const updateProvider = (providerKey, data) => {
                const current = currentConfig[providerKey] || {};
                const updated = {
                    enable: data?.enable !== undefined ? data.enable : (current.enable || false),
                    mode: data?.mode || current.mode || 'multi-tenant',
                    clientId: data?.clientId !== undefined ? data.clientId : current.clientId,
                    // Only update secret if a NEW value is provided (non-empty string)
                    clientSecret: (data?.clientSecret && data.clientSecret.trim() !== '') ? data.clientSecret : current.clientSecret,
                    tenantId: data?.tenantId !== undefined ? data.tenantId : current.tenantId,
                    serviceAccountJson: (data?.serviceAccountJson && data.serviceAccountJson.trim() !== '') ? data.serviceAccountJson : current.serviceAccountJson,
                    metadata: {
                        updatedBy: req.user._id,
                        updatedOn: new Date(),
                        createdBy: current.metadata?.createdBy || req.user._id,
                        createdAt: current.metadata?.createdAt || new Date(),
                        expiryAt: data?.metadata?.expiryAt ? new Date(data.metadata.expiryAt) : current.metadata?.expiryAt
                    }
                };
                return updated;
            };

            const newWorkspaceConfig = {
                google: updateProvider('google', workspaceConfiguration.google),
                microsoft: updateProvider('microsoft', workspaceConfiguration.microsoft)
            };

            company.productSettings.authenticationSettings.workspaceConfiguration = newWorkspaceConfig;
        }

        // Mark as modified because it's Mixed type or deeply nested
        company.markModified('productSettings.authenticationSettings');
        await company.save();

        // Return secure response
        await getIntegrationSettings(req, res);
    } catch (error) {
        console.error('Error updating integration settings:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Public Integration Settings (Client IDs Only)
// @route   GET /api/v1/integration-settings/public
// @access  Public
const getPublicIntegrationSettings = async (req, res) => {
    try {
        const { companyId } = req.query;

        if (!companyId) {
            return res.json({ usedDefault: true });
        }

        const company = await Company.findById(companyId).select('productSettings.authenticationSettings');
        const authSettings = company?.productSettings?.authenticationSettings;
        const workspaceConfig = authSettings?.workspaceConfiguration;

        if (!company || !workspaceConfig) {
            return res.json({ usedDefault: true });
        }

        // Extract safe public identifiers AND policy settings
        const publicConfig = {
            sessionTimeoutInMins: authSettings.sessionTimeoutInMins,
            passwordSize: authSettings.passwordSize,
            maxPasswordSize: authSettings.maxPasswordSize,
            passwordExpiryInDays: authSettings.passwordExpiryInDays,
            mfaEnabled: authSettings.mfaEnabled,
            workspaceConfiguration: {
                google: {
                    enable: workspaceConfig.google?.enable || false,
                    mode: workspaceConfig.google?.mode || 'multi-tenant',
                    clientId: workspaceConfig.google?.clientId || null
                },
                microsoft: {
                    enable: workspaceConfig.microsoft?.enable || false,
                    mode: workspaceConfig.microsoft?.mode || 'multi-tenant',
                    clientId: workspaceConfig.microsoft?.clientId || null,
                    tenantId: workspaceConfig.microsoft?.tenantId || null
                }
            }
        };

        res.json(publicConfig);

    } catch (error) {
        console.error('Error fetching public settings:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Test Permissions (Dummy Check)
// @route   POST /api/v1/integration-settings/test
// @access  Private (Admin)
const testPermissions = async (req, res) => {
    try {
        const { provider, credentials } = req.body;
        // credentials passed from UI

        const results = [];

        if (provider === 'microsoft') {
            const { mode, clientId, clientSecret, tenantId } = credentials;

            const effectiveClientId = mode === 'single-tenant' ? clientId : process.env.MICROSOFT_CLIENT_ID;
            const effectiveClientSecret = mode === 'single-tenant' ? clientSecret : process.env.MICROSOFT_CLIENT_SECRET;
            const effectiveTenantId = mode === 'single-tenant' ? tenantId : process.env.MICROSOFT_TENANT_ID;

            if (!effectiveClientId || !effectiveClientSecret || !effectiveTenantId) {
                return res.json({
                    success: false,
                    results: [{ name: 'Credentials Check', status: 'failed', error: 'Missing Client ID, Secret, or Tenant ID' }]
                });
            }

            try {
                const tokenEndpoint = `https://login.microsoftonline.com/${effectiveTenantId}/oauth2/v2.0/token`;
                const params = new URLSearchParams();
                params.append('client_id', effectiveClientId);
                params.append('client_secret', effectiveClientSecret);
                params.append('scope', 'https://graph.microsoft.com/.default');
                params.append('grant_type', 'client_credentials');

                const response = await axios.post(tokenEndpoint, params.toString());
                const accessToken = response.data.access_token;

                results.push({ name: 'Authentication (Get Token)', status: 'passed' });

                const parts = accessToken.split('.');
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                const roles = payload.roles || [];

                const requiredRoles = ['Sites.Read.All', 'Files.Read.All'];
                requiredRoles.forEach(role => {
                    if (roles.includes(role)) {
                        results.push({ name: `Permission: ${role}`, status: 'passed' });
                    } else {
                        results.push({ name: `Permission: ${role}`, status: 'failed', error: 'Role missing in token' });
                    }
                });

            } catch (err) {
                console.error("MS Test Error:", err.response?.data || err.message);
                const errMsg = err.response?.data?.error_description || err.message;
                results.push({ name: 'Authentication', status: 'failed', error: errMsg });
            }

        } else if (provider === 'google') {
            const { mode, clientId, clientSecret, serviceAccountJson } = credentials;

            results.push({ name: 'Service Account Check', status: 'skipped', error: 'Use "Watch" endpoint to verify real connectivity.' });

            if (mode === 'single-tenant' && !serviceAccountJson) {
                results.push({ name: 'Config Check', status: 'failed', error: 'Service Account JSON missing' });
            } else {
                results.push({ name: 'Config Check', status: 'passed' });
            }
        }

        res.json({ success: true, results });

    } catch (error) {
        console.error('Test Permissions Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getIntegrationSettings,
    updateIntegrationSettings,
    testPermissions,
    getPublicIntegrationSettings
};
