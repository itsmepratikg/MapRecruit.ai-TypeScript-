import React, { memo } from 'react';
import { useWebSocket } from '../../context/WebSocketContext';
import { COLORS } from '../../data/profile';

interface CoPresenceAvatarsProps {
    campaignId: string;
    currentUserId: string;
}

const AvatarItem = memo(({ user, isMe }: { user: any, isMe: boolean }) => {
    const userColorObj = COLORS.find(c => c.name === user.color) || COLORS[0];
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`relative inline-block w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm ${!user.avatar ? userColorObj.class : 'bg-slate-200'} transition-all duration-200 hover:z-20 hover:scale-110 cursor-default`}
            >
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.firstName}
                        className="w-full h-full object-cover rounded-full"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-700">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                )}
                {/* Status Dot */}
                <span className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white dark:ring-slate-800 ${user.status === 'idle' ? 'bg-amber-400' : 'bg-green-400'}`} />
            </div>

            {/* Rich Tooltip */}
            {isHovered && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 pointer-events-none animate-in fade-in zoom-in duration-200">
                    <div className="flex flex-col gap-1">
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                            {user.firstName} {user.lastName} {isMe && '(You)'}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <span className="font-medium">Page:</span> {user.page || 'Campaign'}
                        </div>
                        <div className="text-[10px] flex items-center gap-1">
                            <span className="font-medium text-slate-500 dark:text-slate-400">Status:</span>
                            <span className={user.status === 'idle' ? 'text-amber-500' : 'text-green-500'}>
                                {user.status === 'idle' ? 'Idle' : 'Active'}
                            </span>
                        </div>
                    </div>
                    {/* Arrow (Pointing Up) */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-white dark:border-b-slate-800" />
                </div>
            )}
        </div>
    );
});

export const CoPresenceAvatars = ({ campaignId, currentUserId }: CoPresenceAvatarsProps) => {
    const { activeUsers } = useWebSocket();

    // Filter users in this campaign AND exclude self
    const otherUsersInRoom = React.useMemo(() => {
        return Array.from(activeUsers.values()).filter(u => {
            const isMe = String(u.id) === String(currentUserId);
            const inRoom = String(u.campaignId) === String(campaignId);
            return inRoom && !isMe;
        });
    }, [activeUsers, campaignId, currentUserId]);

    if (otherUsersInRoom.length === 0) return null;

    return (
        <div className="flex items-center -space-x-2 py-1 px-1">
            {otherUsersInRoom.map((user) => (
                <AvatarItem key={user.id} user={user} isMe={false} />
            ))}
        </div>
    );
};
