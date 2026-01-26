import { Mail, FileText, Video, MessageSquare } from '../Icons';

export const CARD_WIDTH = 280;
export const CARD_HEIGHT = 160;
export const BUBBLE_SIZE = 40;
export const START_NODE_WIDTH = 200;
export const START_NODE_HEIGHT = 64;

export const NODE_TYPES: any = {
    ANNOUNCEMENT: { color: "bg-purple-100 border-purple-300 text-purple-700", icon: Mail, label: "Announcement" },
    SCREENING: { color: "bg-blue-100 border-blue-300 text-blue-700", icon: FileText, label: "Screening" },
    INTERVIEW: { color: "bg-orange-100 border-orange-300 text-orange-700", icon: Video, label: "Interview" },
    SURVEY: { color: "bg-teal-100 border-teal-300 text-teal-700", icon: MessageSquare, label: "Survey" },
};
