import { useEffect } from 'react';
import { useLocalStorage } from "@uidotdev/usehooks";
import { useLocation } from 'react-router-dom';

export interface HistoryItem {
    id: string; // Unique ID (usually URL or entity ID)
    type: 'CAMPAIGN' | 'PROFILE' | 'ACCOUNT' | 'PAGE';
    title: string;
    url: string;
    timestamp: number;
    metadata?: any;
}

export const useRecentItems = () => {
    const [recentItems, setRecentItems] = useLocalStorage<HistoryItem[]>("mra_recent_items", []);
    const [pinnedItems, setPinnedItems] = useLocalStorage<HistoryItem[]>("mra_pinned_items", []);

    const location = useLocation();

    // Helper to add item
    const addRecentItem = (item: Omit<HistoryItem, 'timestamp'>) => {
        setRecentItems((prev) => {
            // Remove if exists (to move to top)
            const filtered = prev.filter(i => i.url !== item.url);
            // Add to top
            const updated = [{ ...item, timestamp: Date.now() }, ...filtered];
            // Limit to 5
            return updated.slice(0, 5);
        });
    };

    const togglePin = (item: HistoryItem) => {
        setPinnedItems((prev) => {
            const exists = prev.find(i => i.url === item.url);
            if (exists) {
                // Unpin
                return prev.filter(i => i.url !== item.url);
            } else {
                // Pin (check limit)
                if (prev.length >= 3) {
                    // Start removing oldest pinned? Or just block? 
                    // Requirement says Max 3. Let's block or replace oldest.
                    // Let's replace oldest for better UX, or just strict limit.
                    // User said "Maximum of 3 pinned items". 
                    // Let's just keep strict 3 for now, maybe warn user if I could.
                    // For now, replacing the last one seems friendlier than failing silently.
                    const newPinned = [item, ...prev];
                    return newPinned.slice(0, 3);
                }
                return [item, ...prev];
            }
        });
    };

    const isPinned = (url: string) => {
        return pinnedItems.some(i => i.url === url);
    };

    return {
        recentItems,
        pinnedItems,
        addRecentItem,
        togglePin,
        isPinned
    };
};
