
import { GenerateJDFormState } from '../components/Campaign/Generator/GenerateJDForm';
import { Campaign, JobDetails, JobRequirements, SkillRequirement } from '../types/Campaign';

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
        jobBoards: string[]; // "LinkedIn", "AppCast", "Indeed"
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
            // UI provides grouped skills, we flatten them for the new schema or keep them logic-based?
            // "Campaign.ts" defines flat SkillRequirement[], but JSONs showed nested structures sometimes.
            // Requirement was to map "Required" -> "Required", "Important" -> "High".

            const flatSkills: SkillRequirement[] = [];

            skills.forEach(group => {
                if (group.skills) {
                    group.skills.forEach((skill: any) => {
                        flatSkills.push({
                            text: skill.name,
                            canonical_name: skill.name,
                            eligibilityCheck: checkType,
                            importance: "High", // Defaulting to High, could comes from UI
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
        const mappedLocations = formData.locations.map(loc => ({
            city: "", // extracting from text? or leaving empty if not parsed
            state: "",
            country: "",
            location: loc.value
        }));

        // 3. Construct Payload
        const payload: Partial<Campaign> = {
            companyID: user?.companyId || "", // From Session
            clientID: user?.clientId || "",   // From Session
            userID: user?.id || "",             // Current User

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
                ownerID: settings.teams.ownerID.length > 0 ? settings.teams.ownerID : [user?.id],
                managerID: settings.teams.managerID,
                recruiterID: settings.teams.recruiterID
            },
            sharedUserID: [], // Initialize empty

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
                        text: formData.jobTitle
                    },
                    locations: mappedLocations,
                    offeredSalary: {
                        min: Number(formData.salary.min) || 0,
                        max: Number(formData.salary.max) || 0,
                        currency: formData.salary.currency,
                        period: formData.salary.period
                    },
                    workingHours: {
                        min: Number(formData.hours.min) || 0,
                        max: Number(formData.hours.max) || 0,
                        type: "Per Day" // Defaulting
                    },
                    jobType: formData.jobType,
                    jobDescription: {
                        text: descriptionHtml
                    }
                },
                requirements: {
                    skills: combinedSkills,
                    // Additional legacy buckets
                    contextualSkills: [],
                    removedSkills: [],
                    importantLines: [],
                    suggestedSkills: []
                }
            },

            // Initializing AI Config
            MRIPreferences: {
                experience: { enable: true, weightage: 0.5, matchRelatedEntities: true },
                skills: { enable: true, weightage: 0.5, matchRelatedEntities: true },
                education: { enable: true, weightage: 0.5, matchRelatedEntities: true },
                jobTitle: { enable: true, weightage: 0.5, matchRelatedEntities: true },
                industry: { enable: true, weightage: 0.5, matchRelatedEntities: true },
                location: { enable: true, weightage: 0.5, matchRelatedEntities: true },
                YOE: { minYOE: 0, maxYOE: 50 }
            },

            // Arrays
            screeningRounds: [],
            qualifyingRounds: [],
            tags: [],

            // Stats
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
        if (!original) return true; // New campaign
        return !deepEqual(original, current);
    },

    /**
     * Mock API Call to Save Campaign
     */
    saveCampaign: async (campaign: Partial<Campaign>): Promise<{ success: boolean; data?: Campaign, message?: string }> => {
        console.log("Saving Campaign Payload:", JSON.stringify(campaign, null, 2));

        // Simulate Network Delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate 304 Not Modified logic (if applicable in real API)
        // For creation, it's always new. for edit, we can check updatedAt.

        // Cast to full Campaign for return
        return { success: true, data: { ...campaign, _id: "new_mock_id_" + Date.now() } as Campaign };
    }
};
