
import React, { useState } from 'react';
import { SearchProfile } from './SearchProfile';
import { FolderMetricsView } from './FoldersMetrics';
import { TagsView } from './Tags';
import { SharedProfiles } from './SharedProfiles';
import { FavoriteProfiles } from './FavoriteProfiles';
import { DuplicateProfiles } from './DuplicateProfiles';
import { LocalProfiles } from './LocalProfiles';
import { ViewMode } from '../../types';

export const Profiles = ({ onNavigateToProfile, view }: { onNavigateToProfile: () => void, view: ViewMode }) => {
  return (
    <div className="flex-1 overflow-hidden h-full flex flex-col">
        {view === 'SEARCH' && <SearchProfile onNavigateToProfile={onNavigateToProfile} />}
        {view === 'FOLDERS' && <FolderMetricsView />}
        {view === 'TAGS' && <TagsView />}
        {view === 'SHARED' && <SharedProfiles />}
        {view === 'FAVORITES' && <FavoriteProfiles />}
        {view === 'DUPLICATES' && <DuplicateProfiles />}
        {view === 'LOCAL' && <LocalProfiles />}
    </div>
  );
};
