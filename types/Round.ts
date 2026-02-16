
export interface Question {
    question: {
        text: string;
        mediaURL?: string;
    };
    questionFormat: "TEXT" | "MCQ" | "RATING" | string;
    questionType: "QUESTION" | "INFO" | string;
    responseType: "AUDIO" | "VIDEO" | "TEXT" | "MCQ" | "None";
    durationInMinutes?: number;
    // For MCQ or Auto-grading
    expectedResponse?: {
        options?: string[];
        correctOption?: string;
        matchScore?: number;
    };
    optional?: boolean;
}

export interface RoundAutomation {
    automate: boolean;
    automateDetails: {
        automationPreference: "Regular Intervals" | "Immediate" | "Specific Times" | string;
        automateBuffer?: number; // e.g., minutes
        timeZone?: string;
        excludeDays?: string[];
        timings?: string[]; // ["09:00", "14:00"]
    };
}

export interface RoundEligibility {
    eligibilityCriteria: "Any of these" | "All of these" | "None of these";
    MRI?: {
        enable: boolean;
        minMRIScore: number;
        maxMRIScore: number;
    };
    expectedResponseScore?: {
        enable: boolean;
        minExpectedResponseScore: number;
        maxExpectedResponseScore: number;
    };
    previousScreeningRound?: {
        enable: boolean;
        roundName?: string;
        procedure?: "Feedback" | "Response";
        condition?: string; // "5 Star", "Specific Answer"
    };
    tags?: {
        includeProfileTags?: string[];
        excludeProfileTags?: string[];
        includeFolders?: string[];
        excludeFolders?: string[];
    };
    filters?: {
        includeSources?: string[];
        excludeSources?: string[];
        includeSkills?: string[];
        excludeSkills?: string[];
        includeCompanies?: string[];
        excludeCompanies?: string[];
        includeCampaigns?: string[]; // IDs
        lastCommunicated?: string; // Date string or range
    };
}

export interface ReachOutChannelConfig {
    selected: boolean;
    senderID?: string;
    templateID?: string;
    conditionalTemplate?: boolean;
    followUp?: {
        selected: boolean;
        maxCount?: number;
        duration?: number;
        timeUnit?: string; // "Hours", "Days"
    };
}

export interface ReachOutSources {
    email?: ReachOutChannelConfig;
    SMS?: ReachOutChannelConfig;
    whatsApp?: ReachOutChannelConfig;
    phone?: ReachOutChannelConfig;
}

export interface ScreeningRound {
    roundName: string;
    roundType: "Announcement" | "Assessment" | "Note" | "Interview" | "Survey" | string;
    description?: {
        text: string;
    };
    communicationMethod?: string; // For Announcement

    // Questions (Assessment/Survey)
    questions?: Question[];

    // Interview Specifics
    availableMeetTypes?: string[]; // ["Live Video", "In-Person", "Phone"]
    f2fSchedule?: {
        scheduleAt?: {
            startTime: string;
            endTime: string;
        };
        scheduledHostID?: string[]; // User IDs
        location?: {
            address?: string;
            city?: string;
            state?: string;
            country?: string;
            pin?: string;
        };
        liveMedia?: "Video" | "Phone" | "In-Person";
        liveURL?: string;
        participants?: string[];
        feedBack?: {
            rating?: number;
            comment?: string;
            status?: string;
        };
        reminderEmail?: {
            selected: boolean;
            reminderTime: number;
        };
        reminderSMS?: {
            selected: boolean;
            reminderTime: number;
        };
    };

    // Configuration
    automateDetails?: RoundAutomation["automateDetails"]; // Flatted in some JSONs or nested
    roundEligibility?: RoundEligibility;
    reachOutSources?: ReachOutSources;

    // UI State
    collapsed?: boolean;
    order?: number;
}
