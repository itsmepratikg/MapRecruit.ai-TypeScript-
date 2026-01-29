
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Send, ArrowLeft, Mail, MessageSquare } from '../../components/Icons';
import { useNavigate } from 'react-router-dom';

export const SupportPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        subject: 'Login Issue / Account Access',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitted(true);
        setIsSubmitting(false);
    };

    if (submitted) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
                <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-xl text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                        <Send className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t("Request Sent")}</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        {t("Your support request has been received. Our team will get back to you shortly.")}
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl"
                    >
                        {t("Back to Login")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-900 p-6 sm:p-12">
            <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 self-start"
            >
                <ArrowLeft size={20} />
                {t("Back to Login")}
            </button>

            <div className="max-w-2xl mx-auto w-full space-y-8">
                <div className="text-center md:text-left space-y-4">
                    <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto md:mx-0 border border-orange-500/20">
                        <AlertCircle className="w-8 h-8 text-orange-500" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {t("Account Support")}
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        {t("If you're having trouble accessing your account, please provide your details below and our team will assist you.")}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t("Your Email")}</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-3.5 text-slate-400" />
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t("Issue Description")}</label>
                        <div className="relative">
                            <MessageSquare size={18} className="absolute left-4 top-4 text-slate-400" />
                            <textarea
                                required
                                rows={5}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                                placeholder={t("Tell us what happened...")}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Send size={20} />
                                {t("Submit Request")}
                            </>
                        )}
                    </button>
                </form>

                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-center">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium leading-relaxed">
                        {t("Support requests are typically reviewed within 24 hours.")}
                    </p>
                </div>
            </div>
        </div>
    );
};
