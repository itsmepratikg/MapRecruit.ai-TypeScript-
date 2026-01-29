
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
import { GLOBAL_CAMPAIGNS } from '../../data';
import { Campaign } from '../../types';

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

    useEffect(() => {
        const loadCampaign = async () => {
            // 1. Mock Check
            const mock = GLOBAL_CAMPAIGNS.find(c => c.id.toString() === id);
            if (mock) {
                setCampaign(mock);
                setLoading(false);
                return;
            }

            // 2. API Fetch
            try {
                // Using the unified getAll for now, ideally getById
                const campaigns = await NewCampaignService.saveCampaign ? [] : []; // access check 
                // For now, assume global or fetch
                // reusing logic from App.tsx wrapper roughly
                const all = await campaignService.getAll();
                const found = all.find((c: any) => (c._id?.$oid || c._id)?.toString() === id);
                if (found) setCampaign(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadCampaign();
    }, [id]);

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
            <CampaignHeader campaign={campaign} isScrolled={isScrolled} onBack={() => navigate('/campaigns')} />
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar">
                <Component campaign={campaign} activeView={activeTab} {...subProps} />
            </div>
        </div>
    );
};

export const CampaignExternalRoutes = () => {
    return (
        <Routes>
            {/* /showcampaign/intelligence/:id */}
            <Route path="intelligence/:id" element={
                <ExternalRouteWrapper component={Intelligence} activeTab="INTELLIGENCE" />
            } />

            {/* /showcampaign/sourceai/jobdescription/:id */}
            <Route path="sourceai/jobdescription/:id" element={
                <ExternalRouteWrapper component={SourceAIWrapper} activeTab="JD" />
            } />

            {/* /showcampaign/sourceai/integrations/:id */}
            <Route path="sourceai/integrations/:id" element={
                <ExternalRouteWrapper component={SourceAIWrapper} activeTab="INTEGRATIONS" />
            } />

            {/* /showcampaign/sourceai/attachpeople/:id */}
            <Route path="sourceai/attachpeople/:id" element={
                <ExternalRouteWrapper component={SourceAIWrapper} activeTab="ATTACH" />
            } />

            {/* /showcampaign/matchai/:id */}
            <Route path="matchai/:id" element={
                <ExternalRouteWrapper component={MatchAI} activeTab="MATCH" />
            } />

            {/* /showcampaign/engageai/:id */}
            <Route path="engageai/:id" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="BUILDER" />
            } />

            {/* /showcampaign/engageai/:id/:roundId/dashboard */}
            <Route path="engageai/:id/:roundId/dashboard" element={
                <ExternalRouteWrapper component={EngageAIWrapper} activeTab="TRACKING" />
            } />

            {/* Add more specific routes as needed */}

        </Routes>
    );
};
