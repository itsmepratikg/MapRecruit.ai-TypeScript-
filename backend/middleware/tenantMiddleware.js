const Company = require('../models/Company');

/**
 * Middleware to resolve the CompanyID (Tenant) based on the request host or query parameter.
 * Supports Local Development via ?company_id=...
 */
const resolveTenant = async (req, res, next) => {
    try {
        let companyId = null;
        const host = req.get('host');
        // Treat localhost and vercel.app deployments as "local/dev" environments
        // This allows using ?company_id=... on Vercel preview/production URLs
        const isLocal = host.includes('localhost') ||
            host.includes('127.0.0.1') ||
            host.includes('192.168.') ||
            host.includes('.vercel.app');

        // 1. Local Dev Support: Check for ?company_id query param
        if (isLocal && req.query.company_id) {
            companyId = req.query.company_id;
            console.log(`[Tenant] Local resolution via query param: ${companyId}`);
        }

        // 2. Production/Sub-domain Resolution
        if (!companyId) {
            // Extract subdomain (e.g., 'trcqa' from 'trcqa.maprecruit.com')
            const hostParts = host.split('.');
            if (hostParts.length >= 3) {
                const subdomain = hostParts[0];

                // Find company where productDomain contains the subdomain OR explicit subDomain field
                // For flexibility, we look into productSettings.productDomain
                const company = await Company.findOne({
                    $or: [
                        { "productSettings.productDomain": new RegExp(subdomain, 'i') },
                        { "serviceSettings.subDomain": subdomain }
                    ]
                });

                if (company) {
                    companyId = company._id;
                    console.log(`[Tenant] Resolution via subdomain '${subdomain}': ${companyId}`);
                }
            }
        }

        // If no company found and NOT on local, or no id provided on local
        if (!companyId && !isLocal) {
            console.warn(`[Tenant] Failed to resolve tenant for host: ${host}`);
            return res.status(404).json({
                message: 'Tenant Not Found. Invalid sub-domain.',
                code: 'TENANT_NOT_FOUND'
            });
        }

        // Attach resolved CompanyID to the request
        req.companyID = companyId;
        next();
    } catch (error) {
        console.error('[Tenant] Resolution Error:', error);
        res.status(500).json({ message: 'Internal server error during tenant resolution' });
    }
};

module.exports = { resolveTenant };
