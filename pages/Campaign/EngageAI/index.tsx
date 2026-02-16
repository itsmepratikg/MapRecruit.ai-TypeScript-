
import React from 'react';
import { WorkflowBuilder } from './WorkflowBuilder';
import { InterviewPanel } from './InterviewPanel';
import { CandidateList } from './CandidateList';

export const EngageAIWrapper = ({ activeView = 'BUILDER' }: { activeView?: string }) => {
    if (activeView === 'ROOM') return <InterviewPanel />;
    if (activeView === 'TRACKING') return <CandidateList />;

    // For Builder, Questionnaire, Automation, Templates - render Builder
    // The Builder will handle opening the correct modal based on URL/Props
    return <WorkflowBuilder activeView={activeView} />;
};
