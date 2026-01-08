
import React from 'react';
import { Briefcase } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const CampaignNotes = () => {
  return (
    <PlaceholderPage 
      title="Campaign Notes" 
      description="Information manually added by the user regarding specific jobs or campaigns." 
      icon={Briefcase} 
    />
  );
};
