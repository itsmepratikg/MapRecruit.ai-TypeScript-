
import React from 'react';
import { 
  User, MessageSquare, SlidersHorizontal, Calendar, 
  Shield, Lock, Clock, Activity 
} from '../../components/Icons';
import { AccountPlaceholder } from './components/AccountPlaceholder';
import { Appearance } from './Appearance';
import { BasicDetails } from './BasicDetails';
import { Communication } from './Communication';
import { CalendarSettings } from './CalendarSettings';
import { RolesPermissions } from './RolesPermissions';
import { AuthSync } from './AuthSync';
import { UserNotifications } from './UserNotifications';

interface MyAccountProps {
  activeTab: string;
  userOverride?: any; // User object if editing another user
}

export const MyAccount = ({ activeTab, userOverride }: MyAccountProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'BASIC_DETAILS':
        return <BasicDetails userOverride={userOverride} />;
      case 'COMM_PREFS':
        // For now, these components don't explicitly handle overrides but could be extended
        return <Communication />;
      case 'USER_PREFS':
        return <Appearance />;
      case 'CALENDAR':
        return <CalendarSettings />;
      case 'ROLES_PERMISSIONS':
        // Could show effective permissions for the user
        return <RolesPermissions />;
      case 'AUTH_SYNC':
        return <AuthSync />;
      case 'USER_NOTIFICATIONS':
        return <UserNotifications />;
      case 'LAST_LOGIN':
        return <div className="p-8 lg:p-12"><AccountPlaceholder title="Last Login Sessions" description={`Review recent login activity for ${userOverride ? userOverride.name : 'your account'}.`} icon={Clock} /></div>;
      default:
        return <div className="p-8 lg:p-12"><AccountPlaceholder title="Account Settings" description="Select a category from the sidebar to manage account settings." icon={User} /></div>;
    }
  };

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
         {renderContent()}
      </div>
    </div>
  );
};
