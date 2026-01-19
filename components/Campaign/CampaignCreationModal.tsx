
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { GenerateJDForm, GenerateJDFormState } from './Generator/GenerateJDForm';
import CampaignSettingsStep from './CreationSteps/CampaignSettingsStep';
import { CampaignService, CampaignSettings, MongoCampaign } from '../../services/CampaignService';
import toast from 'react-hot-toast';

interface CampaignCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Temporary Mock Users until data.ts is fully integrated
const MOCK_USERS = [
    { id: 'usr_123', name: 'Pratik G', email: 'pratik@maprecruit.ai' },
    { id: 'usr_456', name: 'Sarah Miller', email: 'sarah.m@example.com', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: 'usr_789', name: 'Mike Ross', email: 'mike.r@example.com' },
    { id: 'usr_101', name: 'Jessica P', email: 'jessica.p@example.com', avatar: 'https://i.pravatar.cc/150?u=jessica' },
];

const INITIAL_SETTINGS: CampaignSettings = {
    openJob: true,
    visibility: 'All',
    campaignModules: {
        sourceAI: true,
        matchAI: true,
        engageAI: true
    },
    teams: {
        ownerID: ['usr_123'], // Default to current user
        managerID: [],
        recruiterID: []
    },
    jobPosting: {
        enabled: false,
        startDate: '',
        endDate: '',
        jobBoards: []
    }
};

export const CampaignCreationModal: React.FC<CampaignCreationModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState<number>(1);
    const [jdFormData, setJdFormData] = useState<GenerateJDFormState | null>(null);
    const [generatedHtml, setGeneratedHtml] = useState<string>('');
    const [settings, setSettings] = useState<CampaignSettings>(INITIAL_SETTINGS);
    const [saving, setSaving] = useState(false);

    // Current User Session Mock
    const currentUser = { id: 'usr_123', companyId: 'cmp_001', clientId: 'cli_001' };

    if (!isOpen) return null;

    const handleJDSubmit = (html: string, formData: GenerateJDFormState) => {
        setGeneratedHtml(html);
        setJdFormData(formData);
        setStep(2);
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else {
            onClose();
        }
    };

    const handleCreateCampaign = async () => {
        if (!jdFormData) return;

        setSaving(true);
        try {
            const payload: MongoCampaign = CampaignService.createCampaignPayload(
                jdFormData,
                jdFormData.jobTitle, // Use Job Title as Campaign Title for now
                generatedHtml,
                settings,
                currentUser
            );

            // Mock Check for Changes (Dirty Checking) - In creation, it's always new, 
            // but effectively we are saving the *current* state.

            const result = await CampaignService.saveCampaign(payload);

            if (result.success) {
                toast.success("Campaign Created Successfully!");
                onClose();
                // Reset State
                setStep(1);
                setJdFormData(null);
                setSettings(INITIAL_SETTINGS);
            } else {
                toast.error("Failed to create campaign.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">

                {/* Header for Step 2 (Step 1 has its own header) */}
                {step === 2 && (
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                {t("Review & Settings")}
                            </h2>
                            <p className="text-sm text-slate-500">Configure campaign visibility and teams</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <X size={24} />
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-hidden relative">
                    {step === 1 && (
                        <GenerateJDForm
                            onBack={onClose}
                            onSubmit={handleJDSubmit}
                        />
                    )}

                    {step === 2 && (
                        <div className="h-full overflow-y-auto p-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
                            <div className="max-w-4xl mx-auto pb-20 space-y-8">

                                {/* JD Preview */}
                                <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Job Description Preview</h3>
                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Edit Details
                                        </button>
                                    </div>
                                    <div
                                        className="prose prose-slate dark:prose-invert max-w-none p-4 bg-slate-50 dark:bg-slate-950/30 rounded-lg border border-slate-100 dark:border-slate-800 min-h-[200px]"
                                        dangerouslySetInnerHTML={{ __html: generatedHtml }}
                                    />
                                </section>

                                <CampaignSettingsStep
                                    settings={settings}
                                    onChange={setSettings}
                                    users={MOCK_USERS}
                                    currentUserID={currentUser.id}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer for Step 2 */}
                {step === 2 && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 shrink-0">
                        <button
                            onClick={handleBack}
                            className="px-6 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            {t("Back")}
                        </button>
                        <button
                            onClick={handleCreateCampaign}
                            disabled={saving}
                            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {t("Creating...")}
                                </>
                            ) : (
                                t("Create Campaign")
                            )}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};
