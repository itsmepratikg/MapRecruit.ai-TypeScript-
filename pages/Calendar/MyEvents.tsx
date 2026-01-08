
import React from 'react';
import { Calendar } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const MyEvents = () => {
  return (
    <PlaceholderPage 
      title="My Events" 
      description="View all events created for you in the system or synced through your workspace calendar." 
      icon={Calendar} 
    />
  );
};
