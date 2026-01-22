import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Simple modal trigger event (since we can't easily use React context inside Axios interceptor directly)
export const TRIGGER_SAFETY_MODAL = 'TRIGGER_IMPERSONATION_SAFETY_MODAL';

export const attachSafetyInterceptor = (api: AxiosInstance) => {
    api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
        // 1. Check if we are impersonating
        const userStr = localStorage.getItem('user');
        if (!userStr) return config;

        const user = JSON.parse(userStr);
        // Check if user object has 'mode' (added during impersonation login)
        // OR check sessionStorage for admin backup
        const isImpersonating = sessionStorage.getItem('admin_restore_token'); // Reliable flag

        if (!isImpersonating) return config;

        const mode = user.mode || 'read-only';
        const method = config.method?.toUpperCase() || 'GET';

        // 2. Allow GET/OPTIONS always
        if (method === 'GET' || method === 'OPTIONS') {
            return config;
        }

        // 3. Handle VIEW-ONLY Mode
        if (mode === 'read-only') {
            // Reject immediately
            const error = new Error('Action blocked: You are in View-Only Impersonation mode.');
            (error as any).isSafetyBlock = true;

            // Dispatch simplified event for Toast
            window.dispatchEvent(new CustomEvent('IMPERSONATION_BLOCK_TOAST'));

            return Promise.reject(error);
        }

        // 4. Handle FULL-ACCESS Mode
        if (mode === 'full') {
            // We need to pause and ask for confirmation
            // This is tricky in Axios. We return a Promise that resolves ONLY when user confirms.

            return new Promise((resolve, reject) => {
                const handleConfirm = () => {
                    cleanup();
                    resolve(config);
                };

                const handleCancel = () => {
                    cleanup();
                    const error = new Error('Action cancelled by user.');
                    (error as any).isSafetyBlock = true;
                    reject(error);
                };

                const cleanup = () => {
                    window.removeEventListener('SAFETY_MODAL_CONFIRM', handleConfirm);
                    window.removeEventListener('SAFETY_MODAL_CANCEL', handleCancel);
                };

                window.addEventListener('SAFETY_MODAL_CONFIRM', handleConfirm);
                window.addEventListener('SAFETY_MODAL_CANCEL', handleCancel);

                // Trigger UI Modal
                window.dispatchEvent(new CustomEvent(TRIGGER_SAFETY_MODAL, {
                    detail: {
                        method,
                        url: config.url
                    }
                }));
            });
        }

        return config;
    }, (error) => {
        return Promise.reject(error);
    });
};
