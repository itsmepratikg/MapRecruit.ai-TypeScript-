
import React from 'react';
import { Clock } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const UpcomingEvents = () => {
  return (
    <PlaceholderPage 
      title="Upcoming Events" 
      description="A focused view of events that are about to happen shortly." 
      icon={Clock} 
    />
  );
};
