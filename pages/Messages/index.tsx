
import React from 'react';
import { MessageSquare } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const Messages = () => {
  return (
    <PlaceholderPage 
      title="Messages" 
      description="Two-way direct messaging interface between users in the system." 
      icon={MessageSquare} 
    />
  );
};
