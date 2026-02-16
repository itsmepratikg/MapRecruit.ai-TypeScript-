import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useMap, useNetworkState } from "@uidotdev/usehooks";

interface UserProfile {
    _id?: string;
    id?: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email?: string;
    color?: string; // For fallback avatar color
    campaignId?: string;
    status?: 'active' | 'idle';
    lastSeen?: Date;
}

interface WebSocketContextType {
    socket: Socket | null;
    activeUsers: Map<string, UserProfile>;
    isConnected: boolean;
    isOnline: boolean;
    joinRoom: (campaignId: string, user: UserProfile) => void;
    leaveRoom: () => void;
    updateIdleStatus: (isIdle: boolean) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

// Initialize socket outside component to prevent multiple connections
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [activeUsers, activeUsersActions] = useMap<string, UserProfile>(new Map());
    const [isConnected, setIsConnected] = useState(false);
    const network = useNetworkState();

    // Determine if we are effectively online (browser + socket)
    const isOnline = network.online && isConnected;

    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
            activeUsersActions.set(new Map()); // Clear users on disconnect
        });

        newSocket.on('active-users', (users: UserProfile[]) => {
            // Rebuild the map from the array received from server
            const userMap = new Map();
            users.forEach(u => userMap.set(u.id || u._id || 'unknown', u));
            activeUsersActions.set(userMap);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Heartbeat mechanism
    useEffect(() => {
        if (!socket || !isConnected) return;

        const heartbeatInterval = setInterval(() => {
            socket.emit('heartbeat');
        }, 30000); // 30 seconds

        return () => clearInterval(heartbeatInterval);
    }, [socket, isConnected]);

    const joinRoom = (campaignId: string, user: UserProfile) => {
        if (socket) {
            socket.emit('join-page', { campaignId, user });
        }
    };

    const leaveRoom = () => {
        if (socket) {
            // We can rely on disconnect, or emit a specific leave event if we want to change rooms without disconnecting
            // For now, disconnect or page navigation handling usually covers this, 
            // but explicitly:
            // socket.emit('leave-page'); 
        }
    };

    const updateIdleStatus = (isIdle: boolean) => {
        if (socket) {
            socket.emit('user-idle', isIdle);
        }
    };

    return (
        <WebSocketContext.Provider value={{
            socket,
            activeUsers: activeUsers as unknown as Map<string, UserProfile>, // Cast because useMap implementation might vary slightly
            isConnected,
            isOnline,
            joinRoom,
            leaveRoom,
            updateIdleStatus
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};
