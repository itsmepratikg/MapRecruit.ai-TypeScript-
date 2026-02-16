
import { ScreeningRound } from '../../../types/Round';

export const MOCK_SENDERS = [
    { id: 'sender_1', name: 'John Doe (john@example.com)' },
    { id: 'sender_2', name: 'Jane Smith (jane@example.com)' },
    { id: 'sender_3', name: 'HR Team (hr@example.com)' }
];

export const MOCK_TEMPLATES = [
    { id: 'template_1', name: 'Initial Invitation' },
    { id: 'template_2', name: 'Follow-up Email' },
    { id: 'template_3', name: 'Rejection Email' },
    { id: 'template_4', name: 'Assessment Link' }
];

export const MOCK_SCREENING_ROUND: ScreeningRound = {
    roundName: "Initial Screening Survey",
    roundType: "Survey",
    communicationMethod: "Outbound",
    description: {
        text: "<p>Please complete this survey to help us understand your background.</p>"
    },
    questions: [
        {
            question: { text: "How many years of React experience do you have?" },
            questionFormat: "TEXT",
            questionType: "QUESTION",
            responseType: "TEXT",
            optional: false
        }
    ],
    roundEligibility: {
        eligibilityCriteria: "All of these",
        MRI: { enable: true, minMRIScore: 7, maxMRIScore: 10 },
        // EQ: { enable: false, minEQScore: 0, maxEQScore: 10 }, 
        tags: { includeProfileTags: ["React", "TypeScript"], excludeProfileTags: ["Junior"] }
    },
    reachOutSources: {
        email: {
            selected: true,
            senderID: 'sender_1',
            templateID: 'template_1',
            conditionalTemplate: false,
            followUp: {
                selected: true,
                duration: 2,
                timeUnit: 'Days'
            }
        },
        SMS: {
            selected: false
        }
    },
    automateDetails: {
        automationPreference: "Immediate",
        excludeDays: ["Saturday", "Sunday"],
        timeZone: "Asia/Kolkata"
    }
};

export const MOCK_INTERVIEW_ROUND: ScreeningRound = {
    roundName: "Technical Interview",
    roundType: "Interview",
    communicationMethod: "Inbound",
    description: {
        text: "<p>Let's discuss your technical skills.</p>"
    },
    availableMeetTypes: ["Live Video", "Phone"],
    f2fSchedule: {
        liveMedia: "Video",
        scheduleBuffer: 15,
        reminderEmail: { selected: true, reminderTime: 60 },
        scheduleAt: {
            startTime: "09:00",
            endTime: "17:00"
        }
    },
    reachOutSources: {
        email: {
            selected: true,
            senderID: 'sender_3', // HR Team
            templateID: 'template_4'
        }
    }
};
