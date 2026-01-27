import React from 'react';
import { X, Mail, Phone, Globe, Linkedin, Twitter, Facebook, Instagram, Github } from 'lucide-react';

interface ContactPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        emails: any[];
        phones: any[];
        socials?: any[];
    };
}

export const ContactPreviewModal = ({ isOpen, onClose, data }: ContactPreviewModalProps) => {
    if (!isOpen) return null;

    const { emails, phones, socials = [] } = data;

    const getSocialIcon = (network: string) => {
        const lower = network.toLowerCase();
        if (lower.includes('linkedin')) return <Linkedin size={16} />;
        if (lower.includes('twitter')) return <Twitter size={16} />;
        if (lower.includes('facebook')) return <Facebook size={16} />;
        if (lower.includes('instagram')) return <Instagram size={16} />;
        if (lower.includes('github')) return <Github size={16} />;
        return <Globe size={16} />;
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Contact Details</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* EMAILS */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Mail size={14} /> Email Addresses
                        </h3>
                        {emails && emails.length > 0 ? (
                            <div className="space-y-2">
                                {emails.map((email: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{email.address || email.text || email}</span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-xs bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-500 px-2 py-1 rounded shadow-sm hover:text-blue-600">Copy</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No email addresses found.</p>
                        )}
                    </div>

                    {/* PHONES */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Phone size={14} /> Phone Numbers
                        </h3>
                        {phones && phones.length > 0 ? (
                            <div className="space-y-2">
                                {phones.map((phone: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-green-200 dark:hover:border-green-800 transition-colors">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{phone.number || phone.text || phone}</span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-xs bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-500 px-2 py-1 rounded shadow-sm hover:text-green-600">Call</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No phone numbers found.</p>
                        )}
                    </div>

                    {/* SOCIALS */}
                    {socials && socials.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Globe size={14} /> Social Profiles
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {socials.map((social: any, idx: number) => (
                                    <a
                                        key={idx}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {getSocialIcon(social.network || 'website')}
                                        <span className="font-medium">{social.network || 'Website'}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
