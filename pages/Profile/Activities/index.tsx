import React from 'react';
import { ActivitiesView } from '../../../components/ProfileViews';

interface ActivitiesProps {
    companyID?: string;
    resumeID?: string;
}

export const Activities = ({ companyID, resumeID }: ActivitiesProps) => {
    return <ActivitiesView companyID={companyID} resumeID={resumeID} />;
};

export default Activities;
