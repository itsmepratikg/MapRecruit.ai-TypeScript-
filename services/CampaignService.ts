
import { GenerateJDFormState } from '../components/Campaign/Generator/GenerateJDForm';

// --- Interfaces mirroring MongoDB Schema ---

interface MongoLocation {
    text: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    pin: { lat: number; lon: number };
    eligibilityCheck: string;
    circle: { radius: string; metricUnit: string };
    vacancies: number;
}

interface MongoSkill {
    text: string;
    canonical: string[];
    eligibilityCheck: string; // "Required" | "Preferred"
    importance: string; // "High"
    yearsOfExperienceMin: number;
    yearsOfExperienceMax: number;
}

interface MongoSkillGroup {
    bool: string; // "OR"
    skills: MongoSkill[];
}

interface MongoJobDetails {
    jobTitle: {
        text: string;
        jobType: string;
    };
    locations: MongoLocation[];
    offeredSalary: {
        minvalue: number;
        maxvalue: number;
        currency: string;
        period: string;
        eligibilityCheck: string;
        text: string;
    };
    workingHours: {
        minHours: number;
        maxHours: number;
        period: string; // "Per Day"
        daysPeriod: string; // "Per Week"
        minDays: number;
        maxDays: number;
        eligibilityCheck: string;
    };
    jobDescription: {
        text: string; // HTML
    };
}

interface MongoJobRequirements {
    yearsOfExperience: {
        text: string;
        minYears: number;
        maxYears: number;
        eligibilityCheck: string;
    };
    skills: MongoSkillGroup[];
    // Education can be added here if needed
}

export interface CampaignSettings {
    openJob: boolean;
    visibility: 'All' | 'Few' | 'None';
    campaignModules: {
        sourceAI: boolean;
        matchAI: boolean;
        engageAI: boolean;
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

export interface MongoCampaign {
    _id?: string;
    companyID: string;
    clientID: string;
    userID: string;
    title: string;
    displayName: string;
    status: string; // "Active"
    jobStatus: string; // "Active"
    openJob: boolean;
    visibility: string;
    createdAt: string;
    updatedAt: string;
    job: {
        details: MongoJobDetails;
        requirements: MongoJobRequirements;
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
    };
    campaignModules: {
        sourceAI: boolean;
        matchAI: boolean;
        engageAI: boolean;
    };
    // Default Initializations
    screeningRounds: any[];
    qualifyingRounds: any[];
    jobCategory: any[];
    tags: any[];
    tagID: any[];
    packageOpted: string; // "Basic"
    scheduleFlag: string; // "N"
    notifications: boolean; // true
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
    ): MongoCampaign => {

        // 1. Map Skills
        const mapSkillGroup = (skills: any[], checkType: 'Required' | 'Preferred'): MongoSkillGroup[] => {
            // UI provides SkillGroup[], where each group is AND logic? OR logic?
            // Based on logic: UI SkillGroup[] maps to outer [ { bool: "OR", skills: [...] } ]
            // Assuming UI structure: groups[{ skills: [...] }]

            return skills.map(group => ({
                bool: "OR",
                skills: group.skills.map((skill: any) => ({
                    text: skill.name,
                    canonical: [skill.name],
                    eligibilityCheck: checkType,
                    importance: "High",
                    yearsOfExperienceMin: 0,
                    yearsOfExperienceMax: 50
                }))
            }));
        };

        const combinedSkills = [
            ...mapSkillGroup(formData.reqSkills, "Required"),
            ...mapSkillGroup(formData.prefSkills, "Preferred")
        ];

        // 2. Map Locations
        const mappedLocations: MongoLocation[] = formData.locations.map(loc => ({
            text: loc.value,
            // Parsing logic would go here, defaulting for now
            pin: { lat: 0, lon: 0 },
            eligibilityCheck: "Required",
            circle: { radius: "30", metricUnit: "mi" },
            vacancies: 1
        }));

        // 3. Construct Payload
        const payload: MongoCampaign = {
            companyID: user?.companyId || "", // From Session
            clientID: user?.clientId || "",   // From Session
            userID: user?.id || "",             // Current User
            title: campaignTitle,
            displayName: formData.jobTitle || campaignTitle,
            status: "Active",
            jobStatus: "Active",
            openJob: settings.openJob,
            visibility: settings.visibility,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),

            teams: {
                ownerID: settings.teams.ownerID.length > 0 ? settings.teams.ownerID : [user?.id],
                managerID: settings.teams.managerID,
                recruiterID: settings.teams.recruiterID
            },

            jobPosting: {
                enabled: settings.jobPosting.jobBoards.length > 0,
                startDate: settings.jobPosting.startDate,
                endDate: settings.jobPosting.endDate,
                jobBoards: settings.jobPosting.jobBoards
            },

            campaignModules: settings.campaignModules,

            job: {
                details: {
                    jobTitle: {
                        text: formData.jobTitle,
                        jobType: formData.jobType
                    },
                    locations: mappedLocations,
                    offeredSalary: {
                        minvalue: Number(formData.salary.min) || 0,
                        maxvalue: Number(formData.salary.max) || 0,
                        currency: formData.salary.currency,
                        period: formData.salary.period,
                        eligibilityCheck: "Not Required",
                        text: `${formData.salary.min}-${formData.salary.max}`
                    },
                    workingHours: {
                        minHours: Number(formData.hours.min) || 0,
                        maxHours: Number(formData.hours.max) || 0,
                        period: "Per Day",
                        daysPeriod: "Per Week",
                        minDays: 5,
                        maxDays: 6,
                        eligibilityCheck: "Not Required"
                    },
                    jobDescription: {
                        text: descriptionHtml
                    }
                },
                requirements: {
                    yearsOfExperience: {
                        text: `${formData.expMin}-${formData.expMax} Years`,
                        minYears: Number(formData.expMin) || 0,
                        maxYears: Number(formData.expMax) || 0,
                        eligibilityCheck: "Required"
                    },
                    skills: combinedSkills
                }
            },

            // Defaults
            screeningRounds: [],
            qualifyingRounds: [],
            jobCategory: [],
            tags: [],
            tagID: [],
            packageOpted: "Basic",
            scheduleFlag: "N",
            notifications: true
        };

        return payload;
    },

    /**
     * Checks if there are deep changes between original and current campaign data
     */
    hasChanges: (original: MongoCampaign | null, current: MongoCampaign): boolean => {
        if (!original) return true; // New campaign
        return !deepEqual(original, current);
    },

    /**
     * Mock API Call to Save Campaign
     */
    saveCampaign: async (campaign: MongoCampaign): Promise<{ success: boolean; data?: MongoCampaign, message?: string }> => {
        console.log("Saving Campaign Payload:", JSON.stringify(campaign, null, 2));

        // Simulate Network Delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate 304 Not Modified logic (if applicable in real API)
        // For creation, it's always new. for edit, we can check updatedAt.

        return { success: true, data: { ...campaign, _id: "new_mock_id_" + Date.now() } };
    }
};
