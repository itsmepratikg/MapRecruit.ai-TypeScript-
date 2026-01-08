
import React from 'react';
import { History } from '../../../components/Icons';
import { PlaceholderPage } from '../../../components/PlaceholderPage';

export const PastReminder = () => {
  return (
    <PlaceholderPage 
      title="Past Reminders" 
      description="History of reminders and alerts that occurred in the last 24 hours." 
      icon={History} 
    />
  );
};
