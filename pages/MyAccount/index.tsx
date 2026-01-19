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
import { LoginSessions } from './LoginSessions';
import { Routes, Route, Navigate } from 'react-router-dom';

interface MyAccountProps {
  activeTab: string; // Legacy, ignored in favor of routes
  userOverride?: any;
}

export const MyAccount = ({ userOverride }: MyAccountProps) => {

  const getPath = (id: string) => {
    const map: Record<string, string> = {
      'BASIC_DETAILS': 'basicdetails',
      'COMM_PREFS': 'communication',
      'USER_PREFS': 'appearance',
      'CALENDAR': 'calendar',
      'ROLES_PERMISSIONS': 'rolepermissions',
      'AUTH_SYNC': 'authsync',
      'USER_NOTIFICATIONS': 'usernotifications',
      'LAST_LOGIN': 'loginsessions'
    };
    if (map[id]) return map[id];
    return id.split('_').map(w => w.charAt(0).toLowerCase() + w.slice(1).toLowerCase()).join('');
  }

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <Routes>
          <Route path="/" element={<Navigate to={getPath('BASIC_DETAILS')} replace />} />
          <Route path={getPath('BASIC_DETAILS')} element={<BasicDetails userOverride={userOverride} />} />
          <Route path={getPath('COMM_PREFS')} element={<Communication />} />
          <Route path={getPath('USER_PREFS')} element={<Appearance />} />
          <Route path={getPath('CALENDAR')} element={<CalendarSettings />} />
          <Route path={getPath('ROLES_PERMISSIONS')} element={<RolesPermissions />} />
          <Route path={getPath('AUTH_SYNC')} element={<AuthSync />} />
          <Route path={getPath('USER_NOTIFICATIONS')} element={<UserNotifications />} />
          <Route path={getPath('LAST_LOGIN')} element={<LoginSessions />} />
          <Route path="*" element={<Navigate to={getPath('BASIC_DETAILS')} replace />} />
        </Routes>
      </div>
    </div>
  );
};
