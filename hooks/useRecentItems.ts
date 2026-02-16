import { useEffect, useCallback } from 'react';
import { useLocalStorage } from "@uidotdev/usehooks";

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

    // Helper to add item
    const addRecentItem = useCallback((item: Omit<HistoryItem, 'timestamp'>) => {
        setRecentItems((prev) => {
            // Remove if exists to avoid duplicates
            const filtered = prev.filter(i => i.url !== item.url);
            // Add to top
            const updated = [{ ...item, timestamp: Date.now() }, ...filtered];
            // Limit to 5
            return updated.slice(0, 5);
        });
    }, [setRecentItems]);

    const togglePin = useCallback((item: HistoryItem) => {
        setPinnedItems((prev) => {
            const exists = prev.find(i => i.url === item.url);
            if (exists) {
                // Unpin
                return prev.filter(i => i.url !== item.url);
            } else {
                // Pin (check limit)
                if (prev.length >= 3) {
                    // Replace oldest (first one in list? or last? pinned items usually don't have order like recent)
                    // Let's just append and slice last 3 to keep newest pins
                    const newPinned = [item, ...prev];
                    return newPinned.slice(0, 3);
                }
                return [item, ...prev];
            }
        });
    }, [setPinnedItems]);

    const isPinned = useCallback((url: string) => {
        return pinnedItems.some(i => i.url === url);
    }, [pinnedItems]);

    return {
        recentItems,
        pinnedItems,
        addRecentItem,
        togglePin,
        isPinned
    };
};
