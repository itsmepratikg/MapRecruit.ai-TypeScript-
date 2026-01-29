import React from 'react';
import { ProfileDetails } from '../../../components/ProfileViews';

export const Overview = ({ data, onEditSection }: { data: any, onEditSection: (s: string) => void }) => {
    return <ProfileDetails data={data} onEditSection={onEditSection} />;
};

export default Overview;
