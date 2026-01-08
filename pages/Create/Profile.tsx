
import React from 'react';
import { UserPlus } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const CreateProfile = () => {
  return (
    <PlaceholderPage 
      title="Create Profile" 
      description="Interface to create new candidate profiles manually or via resume upload." 
      icon={UserPlus} 
    />
  );
};
