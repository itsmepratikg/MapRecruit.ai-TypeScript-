import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CampaignsView } from '../../../components/ProfileCampaigns';
import { interviewService } from '../../../services/interviewService';

export const LinkedCampaigns = ({ onPreviewCampaign, onShowMatchScore, onSaveFeedback }: { onPreviewCampaign: (c: any) => void, onShowMatchScore: () => void, onSaveFeedback: (id: string, data: any) => Promise<void> }) => {
    const { id: resumeID } = useParams<{ id: string }>();
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            if (!resumeID) return;
            try {
                const data = await interviewService.getAll({ resumeID });
                setInterviews(data);
            } catch (error) {
                console.error("Failed to fetch interviews for campaigns view:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInterviews();
    }, [resumeID]);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return <CampaignsView interviews={interviews} onPreviewCampaign={onPreviewCampaign} onShowMatchScore={onShowMatchScore} onSaveFeedback={onSaveFeedback} />;
};

export default LinkedCampaigns;
