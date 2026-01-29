
import { ScreeningRound } from "./Round";

export interface InterviewResponse {
    roundName: string;
    questionText?: string;
    response: {
        text?: string;
        mediaURL?: string; // S3 link for Audio/Video
        optionSelected?: string; // MCQ
    };
    score?: number;
    status?: "Completed" | "Pending" | "Skipped";
    submittedAt?: string;
}

export interface InterviewFeedback {
    rating: number;
    comment: string;
    status: "Shortlisted" | "Rejected" | "On Hold" | "Pending" | string;
    updatedAt: string;
    updatedBy?: string; // UserID
}

export interface Interview {
    _id: string;
    campaignID: string; // Link to Campaign
    resumeID: string; // Link to Candidate/Resume
    companyID: string;
    clientID: string;
    userID: string;

    linked: boolean; // Active association

    // Data Snapshot / Progress
    screeningRounds: Array<ScreeningRound & {
        // Extending ScreeningRound with Candidate Specifics
        response?: InterviewResponse[];
        status?: "Scheduled" | "Completed" | "Pending";
        feedback?: InterviewFeedback; // Round-specific feedback
    }>;

    // Overall Application Status
    status: string; // "Applied", "Shortlisted", "Rejected", "Offered"
    offerStatus?: string;

    // Overall Feedback
    feedBack: InterviewFeedback;

    sourceAI?: {
        applicationChannel?: string;
        applicationSource?: string;
        [key: string]: any;
    };

    createdAt: string;
    updatedAt: string;
}
