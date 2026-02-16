import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { userService } from '../services/api';

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes
const HEARTBEAT_INTERVAL = 60 * 1000; // 1 minute

export const useSessionTimeout = (onLogout: () => void) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastHeartbeatRef = useRef<number>(0);
    const location = useLocation();

    const resetTimer = (force = false) => {
        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            onLogout();
        }, TIMEOUT_DURATION);

        // Throttled heartbeat to backend
        const now = Date.now();
        const token = localStorage.getItem('authToken');

        if (token && (force || (now - lastHeartbeatRef.current > HEARTBEAT_INTERVAL))) {
            lastHeartbeatRef.current = now;
            userService.updateActiveAt();
        }
    };

    // Reset on route changes (New Page Open)
    useEffect(() => {
        resetTimer(true); // Force heartbeat on page open
    }, [location.pathname]);

    useEffect(() => {
        // Events to listen for activity
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart'
        ];

        const handleActivity = () => {
            resetTimer();
        };

        // Initialize timer
        resetTimer();

        // Add listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [onLogout]);

    return { resetTimer };
};
