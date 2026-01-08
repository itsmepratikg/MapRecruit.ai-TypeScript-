
import React from 'react';
import { Calendar } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const CalendarSync = () => {
  return (
    <PlaceholderPage 
      title="Calendar Synchronization" 
      description="Manage calendar sync status and requests for Google/Outlook." 
      icon={Calendar} 
    />
  );
};
