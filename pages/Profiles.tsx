
import React, { useState } from 'react';
import { FolderOpen, Tag as TagIcon, Search } from '../components/Icons';
import { SearchState } from '../types';
import { EmptyView } from '../components/Common';
import { TalentSearchEngine } from '../components/TalentSearchEngine';

const FoldersView = () => (
  <EmptyView 
    title="Folder Metrics" 
    message="Analyze candidate distribution across your folders." 
    icon={FolderOpen} 
  />
);

const TagsView = () => (
  <EmptyView 
    title="Tags Management" 
    message="Manage global tags and analyze tag usage across the candidate pool." 
    icon={TagIcon} 
  />
);

export const Profiles = ({ onNavigateToProfile, view }: { onNavigateToProfile: () => void, view: 'SEARCH' | 'FOLDERS' | 'TAGS' }) => {
  const [searchState, setSearchState] = useState<SearchState>({
    view: 'initial',
    inputValue: '',
    activeFilters: [],
    searchKeywords: [],
    advancedParams: {},
    chatMessages: []
  });

  return (
    <div className="flex-1 overflow-hidden h-full flex flex-col">
        {view === 'SEARCH' && <TalentSearchEngine searchState={searchState} setSearchState={setSearchState} onNavigateToProfile={onNavigateToProfile} />}
        {view === 'FOLDERS' && <FoldersView />}
        {view === 'TAGS' && <TagsView />}
    </div>
  );
};
