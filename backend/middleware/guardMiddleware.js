const Campaign = require('../models/Campaign');
const Candidate = require('../models/Candidate');

/**
 * Middleware to prevent cross-tenant document access.
 * Checks if the requested document (Profile/Campaign) belongs to the caller's CompanyID.
 */
const tenantGuard = (modelName) => async (req, res, next) => {
    try {
        const docId = req.params.id;
        const currentCompanyId = req.user?.companyID || req.companyID;

        if (!docId || !currentCompanyId) {
            return next();
        }

        let model;
        if (modelName === 'Campaign') model = Campaign;
        else if (modelName === 'Candidate') model = Candidate;
        else return next();

        const doc = await model.findById(docId).select('companyID');

        if (!doc) {
            return res.status(404).json({
                message: 'Document not found.',
                code: 'DOC_NOT_FOUND'
            });
        }

        // Cross-Tenant Check
        if (doc.companyID.toString() !== currentCompanyId.toString()) {
            console.warn(`[Guard] Blocked cross-tenant access to ${modelName} ${docId} from Company ${currentCompanyId}`);
            return res.status(404).json({
                message: 'Oops buddy you are in a wrong place and this doesn\'t exists',
                code: 'CROSS_TENANT_BLOCK'
            });
        }

        next();
    } catch (error) {
        console.error('[Guard] Error:', error);
        res.status(500).json({ message: 'Internal server error during security check' });
    }
};

module.exports = { tenantGuard };
