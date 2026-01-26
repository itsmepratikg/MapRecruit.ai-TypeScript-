const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    let token;
    // console.log(`[DEBUG] Auth Middleware - Checking ${req.method} ${req.originalUrl}`);

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // --- Impersonation Safety Logic ---
            if (req.user.impersonatorId) {
                // If in Read-Only mode, block unsafe methods
                if (req.user.mode === 'read-only' && req.method !== 'GET' && req.method !== 'OPTIONS') {
                    console.warn(`[Audit] Blocked write attempt by Impersonator ${req.user.impersonatorId} on target ${req.user.id}`);
                    return res.status(403).json({
                        message: 'Action blocked: You are in View-Only Impersonation mode.',
                        code: 'IMPERSONATION_READ_ONLY'
                    });
                }

                // Audit Log (Simple console for now, can be expanded to DB)
                if (req.method !== 'GET') {
                    console.info(`[Audit] Write Action by ${req.user.id} (Impersonated by ${req.user.impersonatorId}) -> ${req.method} ${req.originalUrl}`);
                }
            }
            // ----------------------------------

            next();
        } catch (error) {
            console.error('JWT Verification Failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
