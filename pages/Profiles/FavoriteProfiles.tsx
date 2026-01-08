
import React from 'react';
import { Heart } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const FavoriteProfiles = () => {
  return (
    <PlaceholderPage 
      title="Favorite Profiles" 
      description="Access your bookmarked and starred candidates for quick reference." 
      icon={Heart} 
    />
  );
};
