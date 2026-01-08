
import React from 'react';
import { Lock } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const SSO = () => {
  return (
    <PlaceholderPage 
      title="Single Sign-On (SSO)" 
      description="Manage SSO configurations and codes for admins or users." 
      icon={Lock} 
    />
  );
};
