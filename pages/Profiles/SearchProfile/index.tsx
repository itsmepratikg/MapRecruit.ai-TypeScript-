
import React, { useState } from 'react';
import { TalentSearchEngine } from '../../../components/TalentSearchEngine';
import { SearchState } from '../../../types';
import { LandingDashboard } from './LandingDashboard';

export const SearchProfile = ({ onNavigateToProfile }: { onNavigateToProfile: () => void }) => {
  const [searchState, setSearchState] = useState<SearchState>({
    view: 'initial',
    inputValue: '',
    activeFilters: [],
    searchKeywords: [],
    advancedParams: {},
    chatMessages: []
  });

  const handleDirectSearch = (keywordsString: string) => {
    if (keywordsString) {
      const newKeys = keywordsString.split(' ').filter(k => k.trim() !== '');
      // @ts-ignore
      setSearchState((prev: any) => ({
          ...prev,
          searchKeywords: [...new Set([...prev.searchKeywords, ...newKeys])],
          view: 'results'
      }));
    } else {
       // @ts-ignore
       setSearchState((prev: any) => ({ ...prev, view: 'results' })); 
    }
  };

  const handleModifySearch = (keywordsString: string) => {
    // Logic to open advanced modal is handled inside TalentSearchEngine via its state, 
    // but here we just pass the keywords to prompt it.
    // In a real app we might lift isAdvancedOpen state up, but for now we pass keywords 
    // and rely on TalentSearchEngine to use them.
    if (keywordsString) {
      const newKeys = keywordsString.split(' ').filter(k => k.trim() !== '');
      // @ts-ignore
      setSearchState((prev: any) => ({
          ...prev,
          searchKeywords: [...new Set([...prev.searchKeywords, ...newKeys])]
      }));
    }
  };

  return (
    <TalentSearchEngine 
      searchState={searchState} 
      setSearchState={setSearchState} 
      onNavigateToProfile={onNavigateToProfile}
      landingComponent={<LandingDashboard onSearch={handleDirectSearch} onModifySearch={handleModifySearch} />}
    />
  );
};
