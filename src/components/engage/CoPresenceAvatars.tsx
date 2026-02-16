import React, { useEffect } from 'react';
import { useIdle } from "@uidotdev/usehooks";
import { useWebSocket } from '../../context/WebSocketContext';

export const CoPresenceAvatars = () => {
    const { activeUsers, updateIdleStatus, socket } = useWebSocket();
    const isIdle = useIdle(300000); // 5 minutes idle timeout

    useEffect(() => {
        updateIdleStatus(isIdle);
    }, [isIdle, updateIdleStatus]);

    const users = Array.from(activeUsers.values());

    // Filter out current user if desired, or keep all. 
    // Usually presence shows who ELSE is here. activeUsers includes self if we joined.
    // Let's exclude self for the display, or mark self.
    const otherUsers = users.filter(u => u.socketId !== socket?.id);

    if (otherUsers.length === 0) return null;

    return (
        <div className="flex items-center -space-x-2 mr-4">
            {otherUsers.slice(0, 4).map((user) => (
                <div
                    key={user.socketId || user.id}
                    className={`relative w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden ${user.status === 'idle' ? 'opacity-50 grayscale' : ''}`}
                    title={`${user.firstName} ${user.lastName} (${user.status})`}
                >
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center bg-indigo-500 text-white text-xs font-bold`}>
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                    )}
                    {user.status === 'idle' && (
                        <span className="absolute bottom-0 right-0 block w-2 h-2 rounded-full ring-1 ring-white bg-yellow-400" />
                    )}
                </div>
            ))}
            {otherUsers.length > 4 && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300">
                    +{otherUsers.length - 4}
                </div>
            )}
        </div>
    );
};
