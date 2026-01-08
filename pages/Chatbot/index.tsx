
import React from 'react';
import { MessageCircle } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const Chatbot = () => {
  return (
    <PlaceholderPage 
      title="AI Chatbot" 
      description="Configuration and logs for candidate interview chatbots." 
      icon={MessageCircle} 
    />
  );
};
