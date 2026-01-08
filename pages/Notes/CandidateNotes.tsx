
import React from 'react';
import { Users } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const CandidateNotes = () => {
  return (
    <PlaceholderPage 
      title="Candidate Notes" 
      description="Notes added by the user for a candidate, or notes added by candidates for the user." 
      icon={Users} 
    />
  );
};
