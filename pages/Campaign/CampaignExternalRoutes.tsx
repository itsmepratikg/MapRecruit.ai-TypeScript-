
import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { CampaignHeader } from './index';
import { Intelligence } from './Intelligence';
import { SourceAIWrapper } from './SourceAI';
import { MatchAI } from './MatchAI';
import { EngageAIWrapper } from './EngageAI';
import { CampaignSettings } from './Settings';
import { campaignService } from '../../services/api'; // Using generic api proxy or CampaignService?
import { CampaignService as NewCampaignService } from '../../services/CampaignService'; // The one we refactored

import { Campaign } from '../../types';
import { Recommendations } from './Recommendations';
import { Navigate } from 'react-router-dom';
import { useWebSocket } from '../../context/WebSocketContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { mapCampaignToUI } from '../Campaigns';

// Wrapper to fetch campaign and render content with Header
const ExternalRouteWrapper = ({
    component: Component,
    activeTab,
    subProps = {}
}: {
    component: React.ComponentType<any>,
    activeTab: any,
    subProps?: any
}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { joinRoom, leaveRoom } = useWebSocket();
    const { userProfile } = useUserProfile();

    useEffect(() => {
        const loadCampaign = async () => {


            // 2. API Fetch
            try {
                // Using the unified getAll for now, ideally getById
                const campaigns = await NewCampaignService.saveCampaign ? [] : []; // access check 
                // For now, assume global or fetch
                // reusing logic from App.tsx wrapper roughly
                const all = await campaignService.getAll();
                const found = all.find((c: any) => (c._id?.$oid || c._id)?.toString() === id);
                if (found) setCampaign(mapCampaignToUI(found));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadCampaign();
    }, [id]);

    // Join Room
    useEffect(() => {
        if (id && userProfile) {
            joinRoom(id, {
                id: userProfile.id || 'visitor',
                firstName: userProfile.firstName || 'Visitor',
                lastName: userProfile.lastName || '',
                email: userProfile.email || '',
                color: userProfile.color || 'blue',
                avatar: userProfile.avatar
            }, activeTab);

            return () => {
                leaveRoom(id, userProfile.id || 'visitor');
            };
        }
    }, [id, userProfile, joinRoom, leaveRoom]);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                setIsScrolled(scrollContainerRef.current.scrollTop > 10);
            }
        };
        const container = scrollContainerRef.current;
        if (container) container.addEventListener('scroll', handleScroll);
        return () => { if (container) container.removeEventListener('scroll', handleScroll); };
    }, []);

    if (loading) return <div className="p-12 text-center animate-pulse">Loading...</div>;
    if (!campaign) return <div className="p-12 text-center text-red-500">Campaign Not Found</div>;

    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900 transition-colors overflow-hidden">
            <CampaignHeader campaign={campaign} isScrolled={isScrolled} onBack={() => navigate('/campaigns')} currentUserId={userProfile?.id} />
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar">
                <Component campaign={campaign} activeView={activeTab} {...subProps} />
            </div>
        </div>
    );
};

export const CampaignExternalRoutes = () => {
    return (
        <Routes>
            {/* --- INTELLIGENCE --- */}
            <Route path="intelligence/:id" element={
                <ExternalRouteWrapper component={Intelligence} activeTab="INTELLIGENCE" />
            } />

            {/* --- SOURCE AI --- */}
            <Route path="sourceai/attachpeople/:id" element={
                <ExternalRouteWrapper component={SourceAIWrapper} activeTab="ATTACH" />
            } />
            <Route path="sourceai/profiles/:id" element={
                <ExternalRouteWrapper component={SourceAIWrapper} activeTab="PROFILES" />
            } />
            <Route path="sourceai/portalsourcing/:id/emailtemplates" element={
                <ExternalRouteWrapper component={SourceAIWrapper} activeTab="TEMPLATES" />
            } />
            <Route path="sourceai/portalsourcing/:id/analytics" element={
                <ExternalRouteWrapper component={SourceAIWrapper} activeTab="ANALYTICS" />
            } />
            <Route path="sourceai/integrations/:id" element={
                <ExternalRouteWrapper component={SourceAIWrapper} activeTab="INTEGRATIONS" />
            } />
            <Route path="sourceai/jobdescription/:id" element={
                <ExternalRouteWrapper component={SourceAIWrapper} activeTab="JD" />
            } />

            {/* --- MATCH AI --- */}
            <Route path="matchai/:id" element={
                <ExternalRouteWrapper component={MatchAI} activeTab="MATCH" />
            } />

            {/* --- ENGAGE AI --- */}
            {/* Default Builder View */}
            <Route path="engageai/:id" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="BUILDER" />
            } />

            {/* Specific Round Routes */}
            <Route path="engageai/:id/:roundId/dashboard" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="TRACKING" />
            } />
            <Route path="engageai/:id/:roundId/questionnaire" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="QUESTIONNAIRE" />
            } />
            <Route path="engageai/:id/:roundId/autoschedule" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="AUTOSCHEDULE" />
            } />
            <Route path="engageai/:id/:roundId/reachouttemplates/:channel" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="TEMPLATES" />
            } />
            <Route path="engageai/:id/:roundId/automation" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="AUTOMATION" />
            } />
            <Route path="engageai/:id/:roundId/room" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="ROOM" />
            } />

            {/* --- RECOMMENDATIONS --- */}
            <Route path="recommendedprofiles/:id" element={
                <ExternalRouteWrapper component={Recommendations} activeTab="PROFILES" />
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="intelligence" replace />} />

        </Routes>
    );
};
