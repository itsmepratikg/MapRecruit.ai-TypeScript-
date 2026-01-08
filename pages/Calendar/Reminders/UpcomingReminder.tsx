
import React from 'react';
import { Bell } from '../../../components/Icons';
import { PlaceholderPage } from '../../../components/PlaceholderPage';

export const UpcomingReminder = () => {
  return (
    <PlaceholderPage 
      title="Upcoming Reminders" 
      description="List of reminders for events or tasks due in the near future." 
      icon={Bell} 
    />
  );
};
