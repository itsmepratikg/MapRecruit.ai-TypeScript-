
import React from 'react';
import { Bell } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const Notifications = () => {
  return (
    <PlaceholderPage 
      title="Notifications Center" 
      description="All toast notifications, alerts, and system messages received by the user." 
      icon={Bell} 
    />
  );
};
