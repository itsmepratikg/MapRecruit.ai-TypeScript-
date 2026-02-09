
import React, { useState } from 'react';
import { ShieldAlert, Mail } from 'lucide-react';
import { SupportRequestModal } from './SupportRequestModal';

import { PagePreloader } from '../Common/PagePreloader';

interface AccessGuardProps {
    children: React.ReactNode;
    user: any;
    clients: any[];
}

export const AccessGuard: React.FC<AccessGuardProps> = ({ children, user, clients }) => {
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    // If user is null (loading state), show a loading spinner instead of rendering children
    // to prevent console errors in child components that expect a valid user object.
    if (!user) {
        return <PagePreloader message="Authenticating Environment..." />;
    }

    // Lockout logic: check if clientID list is empty or logically disabled
    // Assuming clients are provided from the hook, we can also check if they are all 'Inactive' if they have a status field
    // For now, following the requirement: "if User.clientID[] is empty or all is in inactive/disabled state"

    const clientIds = user?.clientID || user?.clients || [];
    const isAdmin = ['Product Admin', 'Admin', 'Super Admin'].includes(user?.role) || user?.accessibilitySettings?.productAdmin === true || user?.productAdmin === true;
    const hasAnyClient = Array.isArray(clientIds) && clientIds.length > 0;

    // Check if any of the assigned clients are active in the full clients list
    const activeClients = clients.filter(c =>
        clientIds.some((id: any) => (id.toString() === c._id.toString())) &&
        (c.status === 'Active' || c.status === true || c.active === true || c.status === undefined)
    );

    // Bypassed for Product Admin
    const isLockedOut = !isAdmin && (!hasAnyClient || (activeClients.length === 0 && clientIds.length > 0));

    if (isLockedOut) {
        return (
            <div className="fixed inset-0 z-[99] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center animate-in fade-in duration-500">
                <div className="max-w-md animate-in slide-in-from-bottom-4 duration-700">
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-500/10">
                        <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-400" />
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
                        Access Restricted
                    </h1>

                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        You do not have access to this feature! <br />
                        Please <button
                            onClick={() => setIsSupportOpen(true)}
                            className="text-orange-600 font-bold hover:underline inline-flex items-center gap-1 group"
                        >
                            Contact
                            <Mail className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button> our support team to enable this feature.
                    </p>

                    <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-mono text-slate-500">
                            Error Code: ERR_NO_ACTIVE_CLIENT_SLOT
                        </div>
                    </div>
                </div>

                <SupportRequestModal
                    isOpen={isSupportOpen}
                    onClose={() => setIsSupportOpen(false)}
                    userId={user?._id || user?.id || 'Unknown'}
                    currentUrl={window.location.href}
                />
            </div>
        );
    }

    return <>{children}</>;
};
