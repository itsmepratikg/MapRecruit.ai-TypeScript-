
import React from 'react';
import { User } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const UserNotes = () => {
  return (
    <PlaceholderPage 
      title="My Notes" 
      description="Personal notes and memos created by the user for their own reference." 
      icon={User} 
    />
  );
};
