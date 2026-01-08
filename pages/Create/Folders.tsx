
import React from 'react';
import { FolderPlus } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const Folders = () => {
  return (
    <PlaceholderPage 
      title="Create Folder" 
      description="Interface to create new folders for categorizing candidate profiles." 
      icon={FolderPlus} 
    />
  );
};
