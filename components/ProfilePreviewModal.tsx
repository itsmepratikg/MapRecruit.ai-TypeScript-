import React from 'react';
import { X } from './Icons';
import { useNavigate } from 'react-router-dom';

interface ProfilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    profileId: string;
}

export const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({ isOpen, onClose, profileId }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleViewFullProfile = () => {
        navigate(`/profile/${profileId}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-[80%] h-[90%] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-t-2xl">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Profile Preview</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleViewFullProfile}
                            className="px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        >
                            View Full Profile
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content - Embedded iframe */}
                <div className="flex-1 overflow-hidden">
                    <iframe
                        src={`/profile/${profileId}?preview=true`}
                        className="w-full h-full border-0"
                        title="Profile Preview"
                    />
                </div>
            </div>
        </div>
    );
};
