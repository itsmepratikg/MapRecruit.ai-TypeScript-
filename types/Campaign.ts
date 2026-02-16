
import { ScreeningRound } from "./Round";

export interface JobDetails {
    jobTitle: {
        text: string;
        jobTitles?: any[]; // Legacy taxonomy
    };
    locations: Array<{
        city: string;
        state: string;
        country: string;
        location?: string;
    }>;
    offeredSalary: {
        min: number;
        max: number;
        currency: string;
        period: string; // "Yearly", "Monthly"
    };
    workingHours?: {
        min: number;
        max: number;
        type: string;
    };
    jobType?: string;
    jobDescription?: {
        text: string;
    };
}

export interface SkillRequirement {
    text: string;
    eligibilityCheck: "Required" | "Preferred" | "Contextual" | string;
    importance: "Very Important" | "Important" | "Less Important" | "Not Required" | string;
    yearsOfExperienceMin?: number;
    yearsOfExperienceMax?: number;
    canonical_name?: string;
    // ... validation scores
}

export interface JobRequirements {
    skills: SkillRequirement[];
    contextualSkills?: any[];
    removedSkills?: any[];
    importantLines?: any[];
    suggestedSkills?: any[];
}

export interface MRIPreferences {
    experience: { enable: boolean; weightage: number; matchRelatedEntities: boolean };
    skills: { enable: boolean; weightage: number; matchRelatedEntities: boolean };
    education: { enable: boolean; weightage: number; matchRelatedEntities: boolean };
    jobTitle: { enable: boolean; weightage: number; matchRelatedEntities: boolean };
    industry: { enable: boolean; weightage: number; matchRelatedEntities: boolean };
    location: { enable: boolean; weightage: number; matchRelatedEntities: boolean };
    YOE: {
        minYOE: number;
        maxYOE: number;
    };
}

export interface CampaignModules {
    enabled: boolean;
    sourceAI: any;
    matchAI: any;
    engageAI: any;
    qualifyAI: any;
}

export interface Campaign {
    _id: string; // ObjectId string
    companyID: string;
    clientID: string;
    userID: string;

    // Core Metadata
    title: string;
    displayName: string;
    status: "Active" | "Pending" | "Closed" | string;
    jobStatus: "Active" | "Hired" | "Closed" | string;
    visibility: "All" | "Few" | "Only Me";
    openJob: boolean;
    packageOpted: string;

    // Timestamps
    createdAt: string;
    updatedAt: string;
    closedAt?: string;

    // Relations
    teams: {
        ownerID: string[];
        managerID: string[];
        recruiterID: string[];
    };
    sharedUserID: string[];

    // Job Data
    job: {
        details: JobDetails;
        requirements: JobRequirements;
        otherInformation?: {
            industry?: string[];
            functionalArea?: string[];
            benefits?: string[];
            [key: string]: any;
        };
        metaData?: any;
    };

    // AI Configuration
    MRIPreferences: MRIPreferences;

    // Modules
    campaignModules: CampaignModules;

    // Rounds
    screeningRounds: ScreeningRound[];
    qualifyingRounds?: ScreeningRound[]; // Legacy/Separate track

    // Posting
    jobPosting?: {
        enabled: boolean;
        startDate: string;
        endDate: string;
        jobBoards: string[];
    };

    // Stats
    stats?: {
        netPromoterScore: any;
        profilesCount: number;
        openings: number;
    };

    // Other
    customData?: Record<string, any>;
    tags?: string[];
    engageStatus?: 'Green' | 'Yellow' | 'Grey';
}
