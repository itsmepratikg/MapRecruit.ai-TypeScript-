import React, { useEffect, useState } from 'react';
import { InterviewsView } from '../../../components/ProfileInterviews';
import { interviewService } from '../../../services/interviewService';
import { useParams } from 'react-router-dom';

export const Interviews = ({ onSelectInterview }: { onSelectInterview: (i: any) => void }) => {
    const { id: resumeID } = useParams<{ id: string }>();
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            if (!resumeID) return;
            try {
                setLoading(true);
                const data = await interviewService.getAll({ resumeID });
                setInterviews(data);
            } catch (error) {
                console.error("Failed to fetch interviews", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, [resumeID]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return <InterviewsView interviews={interviews} onSelectInterview={onSelectInterview} />;
};

export default Interviews;
