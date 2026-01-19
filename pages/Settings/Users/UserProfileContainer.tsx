import React, { useState, useEffect } from 'react';
import { useParams, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
    User, MessageSquare, SlidersHorizontal, Calendar,
    Shield, Lock, Clock, Activity, Settings, ChevronLeft
} from '../../../components/Icons';
import { BasicDetails } from '../../MyAccount/BasicDetails';
import { Communication } from '../../MyAccount/Communication';
import { Appearance } from '../../MyAccount/Appearance';
import { CalendarSettings } from '../../MyAccount/CalendarSettings';
import { RolesPermissions } from '../../MyAccount/RolesPermissions';
import { AuthSync } from '../../MyAccount/AuthSync';
import { UserNotifications } from '../../MyAccount/UserNotifications';
import { AccountPlaceholder } from '../../MyAccount/components/AccountPlaceholder';
import { userService } from '../../../services/api';
import { useToast } from '../../../components/Toast';
import { useTranslation } from 'react-i18next';

export const UserProfileContainer = () => {
    const { t } = useTranslation();
    const { id, section } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (id) {
                try {
                    setLoading(true);
                    const data = await userService.getById(id);
                    setUserData(data);
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchUser();
    }, [id]);


    const currentSection = section || 'basicdetails';

    return (
        <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden">
            {/* Context Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/settings/Users')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                            {t("User Profile")}: {userData?.firstName} {userData?.lastName}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">ID: {id}</p>
                    </div>
                </div>
            </div>


            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {(() => {
                    switch (currentSection) {
                        case 'basicdetails':
                            return <BasicDetails userOverride={userData} />;
                        case 'communication':
                            return <Communication />;
                        case 'appearance':
                            return <Appearance />;
                        case 'calendar':
                            return <CalendarSettings userOverride={userData} />;
                        case 'rolepermissions':
                            return <RolesPermissions />;
                        case 'authsync':
                            return <AuthSync />;
                        case 'usernotifications':
                            return <UserNotifications />;
                        case 'loginsessions':
                            return (
                                <div className="p-8 lg:p-12">
                                    <AccountPlaceholder
                                        title={t("Last Login Sessions")}
                                        description={t("Review recent login activity for {0}.", { name: userData?.firstName })}
                                        icon={Clock}
                                    />
                                </div>
                            );
                        case 'settings':
                            return <UserProfileSettings userData={userData} />;
                        case 'activities':
                            return <UserProfileActivities userId={id} />;
                        default:
                            return <BasicDetails userOverride={userData} />;
                    }
                })()}
            </div>
        </div>
    );
};

const UserProfileSettings = ({ userData }: { userData: any }) => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [status, setStatus] = useState(userData?.status ?? true);

    const handleResetPassword = async () => {
        if (!userData?._id) return;
        try {
            await userService.resetPassword(userData._id);
            addToast(t("Password reset to Domain12!"), 'success');
        } catch (e) {
            addToast(t("Failed to reset password"), 'error');
        }
    };

    const handleToggleStatus = async () => {
        if (!userData?._id) return;
        const newStatus = !status;
        try {
            await userService.update(userData._id, { status: newStatus });
            setStatus(newStatus);
            addToast(`${t("User status updated to")} ${newStatus ? t('Active') : t('Inactive')}`, 'success');
        } catch (e) {
            addToast(t("Failed to update status"), 'error');
        }
    };

    return (
        <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="max-w-3xl mx-auto space-y-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t("User Settings")}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("Manage account status and security credentials.")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("Status")}</p>
                            <p className="text-xs text-slate-500">{t("Active or Inactive (Verified)")}</p>
                        </div>
                        <button
                            onClick={handleToggleStatus}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${status ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}
                        >
                            {status ? t('Active') : t('Inactive')}
                        </button>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Blocked</p>
                            <p className="text-xs text-slate-500">Is account deactivated</p>
                        </div>
                        <button className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-lg text-xs font-bold">
                            No
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("Reset Password")}</p>
                            <p className="text-xs text-slate-500">{t("Resets password to default Domain12! format")}</p>
                        </div>
                        <button
                            onClick={handleResetPassword}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                        >
                            {t("Reset Password")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserProfileActivities = ({ userId }: { userId?: string }) => {
    const { t } = useTranslation();
    return (
        <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="max-w-3xl mx-auto">
                <AccountPlaceholder
                    title={t("User Activities")}
                    description={t("View activity logs for user ID {0}. This feature is currently under development.", { id: userId })}
                    icon={Activity}
                />
            </div>
        </div>
    );
};
