
import React from 'react';
import { CampaignTable } from './components/CampaignTable';

export const ClosedCampaigns = ({ onNavigate, onTabChange }: any) => {
  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto min-h-screen">
       <CampaignTable status="Closed" onNavigateToCampaign={onNavigate} onTabChange={onTabChange} />
    </div>
  );
};
