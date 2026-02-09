import { useState, useEffect } from 'react';
import { useUserProfile } from './useUserProfile';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES } from '../src/i18n';

const DEFAULT_PREFERENCES = {
  theme: "system",
  language: "English (US)",
  languageCode: "en-US",
  dateFormat: "MM/DD/YYYY",
  dashboardConfig: {
    rowHeight: 30,
    margin: 15,
    layouts: {
      desktop: [
        { "id": "welcome", "x": 0, "y": 0, "w": 4, "h": 10, "visible": true },
        { "id": "active_campaigns", "x": 4, "y": 0, "w": 2, "h": 4, "visible": true },
        { "id": "closed_campaigns", "x": 6, "y": 0, "w": 2, "h": 4, "visible": true },
        { "id": "active_profiles", "x": 8, "y": 0, "w": 2, "h": 4, "visible": true },
        { "id": "shortlisted", "x": 10, "y": 0, "w": 2, "h": 4, "visible": true },
        { "id": "alerts", "x": 4, "y": 5, "w": 8, "h": 5, "visible": true },
        { "id": "trend_graph", "x": 0, "y": 11, "w": 6, "h": 12, "visible": true },
        { "id": "source_distribution", "x": 6, "y": 11, "w": 6, "h": 12, "visible": true },
        { "id": "upcoming_interviews", "x": 0, "y": 24, "w": 6, "h": 10, "visible": true },
        { "id": "email_delivery", "x": 6, "y": 24, "w": 6, "h": 10, "visible": true },
        { "id": "portal_reports", "x": 0, "y": 34, "w": 12, "h": 8, "visible": true }
      ]
    }
  }
};

export const useUserPreferences = () => {

  const { userProfile, saveProfile } = useUserProfile();
  const { i18n } = useTranslation();
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  // --- Sync from Profile ---
  useEffect(() => {
    if (userProfile?.accessibilitySettings) {
      setPreferences(prev => ({
        ...prev,
        theme: userProfile.accessibilitySettings.theme || prev.theme,
        languageCode: userProfile.accessibilitySettings.languageCode || prev.languageCode,
        dateFormat: userProfile.accessibilitySettings.dateFormat || prev.dateFormat,
        language: userProfile.accessibilitySettings.language || prev.language,
        dashboardConfig: {
          ...prev.dashboardConfig,
          ...(userProfile.accessibilitySettings.dashboardConfig || {}),
          layouts: {
            ...prev.dashboardConfig.layouts,
            ...(userProfile.accessibilitySettings.dashboardConfig?.layouts || {})
          }
        }
      }));
    }
  }, [userProfile]);

  // --- Explicit Save Action ---
  const saveSettings = async (overridingPrefs?: any) => {
    const prefsToSave = overridingPrefs || preferences;

    // Save to DB via Profile Hook
    if (userProfile?._id) {
      await saveProfile({ accessibilitySettings: prefsToSave });
    }
  };

  // --- Local State Updaters (Previews) ---

  const updateLocalState = (partialPrefs: any) => {
    setPreferences(prev => ({
      ...prev,
      ...partialPrefs,
      dashboardConfig: partialPrefs.dashboardConfig ? {
        ...prev.dashboardConfig,
        ...partialPrefs.dashboardConfig,
        layouts: {
          ...prev.dashboardConfig.layouts,
          ...(partialPrefs.dashboardConfig.layouts || {})
        }
      } : prev.dashboardConfig
    }));
  };

  const updateTheme = (theme: 'light' | 'dark' | 'system') => {
    updateLocalState({ theme });
  };

  const updateLanguage = (code: string) => {
    // Find associated date format
    const locale = SUPPORTED_LOCALES.find(l => l.code === code);

    // Explicitly update i18n
    if (i18n.language !== code) {
      i18n.changeLanguage(code);
    }

    updateLocalState({
      languageCode: code,
      language: locale?.label || 'English (United States)', // Sync legacy field
      dateFormat: locale?.dateFormat || 'MM/DD/YYYY'
    });
  };

  const updateDashboardLayout = (widgets: any[], viewMode: 'desktop' | 'tablet' | 'mobile') => {
    const partial = {
      dashboardConfig: {
        layouts: {
          [viewMode]: widgets
        }
      }
    };
    updateLocalState(partial);
  };

  const resetDashboard = () => {
    updateLocalState({
      dashboardConfig: DEFAULT_PREFERENCES.dashboardConfig
    });
  }

  // --- Effect: Apply Theme ---
  useEffect(() => {
    const applyTheme = (t: string) => {
      let isDark = false;
      if (t === 'dark') {
        isDark = true;
      } else if (t === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme(preferences.theme);

    if (preferences.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preferences.theme]);

  return {
    userAccount: { preferences },
    theme: preferences.theme,
    language: preferences.language,       // Legacy Label
    languageCode: preferences.languageCode, // New Code
    dateFormat: preferences.dateFormat,
    dashboardLayouts: preferences.dashboardConfig.layouts,
    updateTheme,
    updateLanguage,
    updateDashboardLayout,
    resetDashboard,
    saveSettings
  };
};
