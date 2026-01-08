
import React from 'react';
import { History } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const PreviousHistory = () => {
  return (
    <PlaceholderPage 
      title="Previous History" 
      description="A log of pages visited by the user for quick navigation back to recent tasks." 
      icon={History} 
    />
  );
};
