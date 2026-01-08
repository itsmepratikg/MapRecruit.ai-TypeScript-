
import React from 'react';
import { Calendar } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const CandidateAvailability = () => {
  return (
    <PlaceholderPage 
      title="Candidate Availability" 
      description="Feature for fetching real-time availability info of candidates for scheduling meetings." 
      icon={Calendar} 
    />
  );
};
