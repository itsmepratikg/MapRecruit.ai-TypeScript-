
import { GenerateJDFormState } from '../components/Campaign/Generator/GenerateJDForm';
import { Campaign, JobDetails, JobRequirements, SkillRequirement } from '../types/Campaign';
import api from './api';

export interface CampaignSettings {
    openJob: boolean;
    visibility: 'All' | 'Few' | 'None' | "Only Me";
    campaignModules: {
        sourceAI: boolean;
        matchAI: boolean;
        engageAI: boolean;
        qualifyAI: boolean;
    };
    teams: {
        ownerID: string[];
        managerID: string[];
        recruiterID: string[];
    };
    jobPosting: {
        enabled: boolean;
        startDate: string;
        endDate: string;
        jobBoards: string[];
    }
}

// --- Helper Functions ---

const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
};

// --- Service Methods ---

export const CampaignService = {
    /**
     * Transforms Frontend Form Data into MongoDB Schema Payload
     */
    createCampaignPayload: (
        formData: GenerateJDFormState,
        campaignTitle: string,
        descriptionHtml: string,
        settings: CampaignSettings,
        user: any // Current User Session
    ): Partial<Campaign> => {

        // 1. Map Skills
        const mapSkills = (skills: any[], checkType: 'Required' | 'Preferred'): SkillRequirement[] => {
            const flatSkills: SkillRequirement[] = [];
            if (!skills) return flatSkills;

            skills.forEach(group => {
                if (group.skills) {
                    group.skills.forEach((skill: any) => {
                        flatSkills.push({
                            text: skill.name,
                            canonical_name: skill.name,
                            eligibilityCheck: checkType,
                            importance: checkType === 'Required' ? "High" : "Important",
                            yearsOfExperienceMin: 0,
                            yearsOfExperienceMax: 50
                        });
                    });
                }
            });
            return flatSkills;
        };

        const combinedSkills = [
            ...mapSkills(formData.reqSkills, "Required"),
            ...mapSkills(formData.prefSkills, "Preferred")
        ];

        // 2. Map Locations
        const mappedLocations = (formData.locations || []).map(loc => ({
            city: "", // extracting from text? or leaving empty if not parsed
            state: "",
            country: "",
            location: loc.value
        }));

        // 3. Construct Payload
        const payload: Partial<Campaign> = {
            companyID: user?.companyID || user?.companyId || "",
            clientID: user?.clientID || user?.clientId || "",
            userID: user?._id || user?.id || "",

            title: campaignTitle,
            displayName: formData.jobTitle || campaignTitle,

            status: "Active",
            jobStatus: "Active",
            openJob: settings.openJob,
            visibility: settings.visibility === 'None' ? 'Only Me' : settings.visibility,
            packageOpted: "Basic",

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),

            teams: {
                ownerID: settings.teams.ownerID.length > 0 ? settings.teams.ownerID : [user?._id || user?.id],
                managerID: settings.teams.managerID,
                recruiterID: settings.teams.recruiterID
            },
            sharedUserID: [],

            jobPosting: {
                enabled: settings.jobPosting.jobBoards.length > 0,
                startDate: settings.jobPosting.startDate,
                endDate: settings.jobPosting.endDate,
                jobBoards: settings.jobPosting.jobBoards
            },

            campaignModules: {
                enabled: true,
                ...settings.campaignModules
            },

            job: {
                details: {
                    jobTitle: {
                        text: formData.jobTitle || campaignTitle
                    },
                    locations: mappedLocations,
                    offeredSalary: {
                        min: Number(formData.salary?.min) || 0,
                        max: Number(formData.salary?.max) || 0,
                        currency: formData.salary?.currency || 'USD',
                        period: formData.salary?.period || 'Yearly'
                    },
                    workingHours: {
                        min: Number(formData.hours?.min) || 0,
                        max: Number(formData.hours?.max) || 40,
                        type: "Per Week"
                    },
                    jobType: formData.jobType || "Full-time",
                    jobDescription: {
                        text: descriptionHtml
                    }
                },
                requirements: {
                    skills: combinedSkills,
                    contextualSkills: [],
                    removedSkills: [],
                    importantLines: [],
                    suggestedSkills: []
                }
            },

            MRIPreferences: {
                experience: { enable: true, weightage: 0.5, matchRelatedEntities: true },
                skills: { enable: true, weightage: 0.5, matchRelatedEntities: true },
                education: { enable: true, weightage: 0.5, matchRelatedEntities: true },
                jobTitle: { enable: true, weightage: 0.5, matchRelatedEntities: true },
                industry: { enable: true, weightage: 0.5, matchRelatedEntities: true },
                location: { enable: true, weightage: 0.5, matchRelatedEntities: true },
                YOE: { minYOE: 0, maxYOE: 50 }
            },

            screeningRounds: [],
            qualifyingRounds: [],
            tags: [],

            stats: {
                netPromoterScore: 0,
                profilesCount: 0,
                openings: 1
            }
        };

        return payload;
    },

    /**
     * Checks if there are deep changes between original and current campaign data
     */
    hasChanges: (original: Campaign | null, current: Partial<Campaign>): boolean => {
        if (!original) return true;
        return !deepEqual(original, current);
    },

    /**
     * Real API Call to Save Campaign
     */
    saveCampaign: async (campaign: Partial<Campaign>): Promise<{ success: boolean; data?: Campaign, message?: string }> => {
        try {
            const response = await api.post('/campaigns', campaign);
            return { success: true, data: response.data };
        } catch (error: any) {
            console.error("Failed to save campaign:", error);
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to save campaign"
            };
        }
    },

    scrapeJobUrl: async (url: string): Promise<{ success: boolean; data?: { title: string, content: string, text: string }, message?: string }> => {
        try {
            const response = await api.post('/campaigns/scrape', { url });
            return { success: true, data: response.data };
        } catch (error: any) {
            console.error("Failed to scrape URL:", error);
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to scrape URL"
            };
        }
    },

    toggleFavorite: async (id: string): Promise<{ isFavorite: boolean, id: string }> => {
        const response = await api.post(`/campaigns/${id}/favorite`);
        return response.data;
    }
};
