
import React from 'react';
import { MessageCircle } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const ChatSync = () => {
  return (
    <PlaceholderPage 
      title="Chat Integrations" 
      description="Integrate with Google Chat or Microsoft Teams for unified communications." 
      icon={MessageCircle} 
    />
  );
};
